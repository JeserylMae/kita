import { hash } from '@node-rs/argon2';
import { supabase } from '@/config/db';
import { v4 as uuidv4 } from "uuid";
import { PermissionInfo } from './user.types';
import { getDateAfterInterval } from '@/utils/data.helpers';

import * as UserServices from './user.services';
import * as TokenServices from '../token/token.services';
import * as SessionServices from '../token/sessions.services';
import * as PasswordServices from './password.services';

import { 
  renderVerifyEmail, 
  sendEmail 
} from '../email/email.services';

import { 
  AccountNotVerified, 
  ConflictError, 
  ErrorII, 
  Forbidden, 
  InvalidCredentials, 
  RecordNotFound
} from "@/errors";
import { BaseRepository } from '../base/base.repository';


// @TODO: add role validation via middleware

const rolesCache: Record<string, string[]> = {}; 
const permissionsCache: Record<string, PermissionInfo[]> = {};

/**
 * 
 * @param email 
 * @param password 
 * @param role 
 * @returns Promise<boolean>
 */
export const signup = async (
  email: string, 
  password: string, 
  url: string
): Promise<boolean> => {
  const hashedPassword = await hash(password);

  const token = TokenServices.createToken();
  const expiresAt = getDateAfterInterval(new Date(), '24h');
  
  const success = await UserServices.insert({
    auth_id: uuidv4(),
    email: email, 
    password: hashedPassword,
    verification_token: token,
    token_expires_at: expiresAt.toISOString()
  });

  if (!success) {
    throw new ErrorII('Sign up failed.');
  }

  await sendVerificationEmail(email, token, url);

  return success;
}

/**
 * 
 * @param email 
 * @param password 
 * @returns Promise<User | null>
 */
export const signin = async (
  email: string, 
  password: string
) => {
  const user = await UserServices
    .findByEmail(
      email,
      'id',
      'auth_id', 
      'verified_at',
      'default_org'
    );

  if ( !user.verified_at ) {
    throw new AccountNotVerified(
      'User is not verified.'
    );
  } 

  const pwdVerified = await PasswordServices
    .verifyPassword( email, password );

  return (pwdVerified) ? user : null;
}

/**
 * 
 * @param email 
 * @param token 
 */
export const verifyEmail = async (
  email: string,
  token: string
) => {
  const user = await UserServices.findByEmail(
    email, 
    'id', 
    'verification_token', 
    'token_expires_at'
  );

  if (!user.id) {
    throw new InvalidCredentials(
      'Failed to accept verification.'
    );
  }

  if (!user.token_expires_at 
    || user.token_expires_at < new Date()) {
    throw new InvalidCredentials('Token has expired.');
  }

  if (!user.verification_token
    || user.verification_token !== token) {
    throw new InvalidCredentials('Invalid token.');
  }

  UserServices.update(user.id, {
    verified_at: new Date().toISOString()
  })
}

export const resendVerificationEmail =  async (
  email: string,
  url: string
) => {
  const user = await UserServices.findByEmail(
    email,
    'id',
    'verified_at',
    'token_expires_at'
);

  if (!user.id || user.token_expires_at! > new Date()) {
    throw new InvalidCredentials(
      'Failed to resend verification.'
    );
  }

  if (user.verified_at) {
    throw new ConflictError('Account was already verified.');
  }

  const token = TokenServices.createToken();
  const expiresAt = getDateAfterInterval(new Date(), '24h');

  await UserServices.update(user.id, {
    token_expires_at: expiresAt.toISOString(),
    verification_token: token
  });

  await sendVerificationEmail(email, token, url);
}

/**
 * 
 * @param email 
 */
export const requestforgotPassword = async ( 
  email: string,
  resetClientLink: string
) => {
  const token = TokenServices.createToken();

  const user = await UserServices.findByEmail(email, 'id');
  const resetURL = `${resetClientLink}/reset-password?token=${token}`;

  await TokenServices.store(user.id!, token, '15min');
  await PasswordServices.sendResetEmail(email, resetURL);
}

/**
 * 
 * @param email 
 * @param token 
 * @param newPassword 
 * @returns 
 */
export const resetPassword = async ( 
  email: string, 
  token: string, 
  newPassword: string 
) => {
  const tokenData = await TokenServices.find(token);
  
  TokenServices.verify(tokenData);

  const user = await UserServices.findByEmail(email, 'id');
  
  await TokenServices.deleteToken(tokenData.id!);

  const hashedPassword = await hash(newPassword);
  await UserServices.update(
    user.id!, 
    { 'password': hashedPassword }
  )
  await TokenServices.setUsed(tokenData.id!);

  return true;
}

/**
 * 
 * @param userID 
 */
export const logout = async ( 
  sessionID: string,
  userID: string
) => {
  const session = await SessionServices
    .find(sessionID, userID);

  await SessionServices.deleteSession(session.id!);
}

export const getPermissionInfo =  async ( 
  permission: string 
) => {
  if (permission in permissionsCache) {
    return permissionsCache[permission];
  }

  const { data, error } = await supabase
    .from('role_permissions_view')
    .select('role, scope')
    .eq('code', permission);

  if (error) {
    throw new ErrorII(error.message);
  } 

  permissionsCache[permission] = data;

  return data;
}

export const refresh = async (
  userID: string,
  sessionID: string,
  orgID: string | null,
  orgRole: string | null, 
  orgmemID: string | null, 
  branchID?: string | null | undefined, 
  branchRole?: string | null | undefined, 
  branchMemID?: string | null | undefined
) => {
  const session = await SessionServices.find(
    sessionID,
    userID,
    'refresh_token_hash',
    'expires_at'
  );
  
  if (session.expires_at! < new Date) {
    await SessionServices.deleteSession(sessionID);

    throw new Forbidden(
      'Refresh token expired. Please login again.'
    );
  }

  const acstoken = await TokenServices
    .createAccessToken(
      userID,
      sessionID,
      orgID,
      orgRole,
      orgmemID,
      true,
      branchID,
      branchRole,
      branchMemID
    );

  return acstoken;
}

export const getRoleScope = async ( 
  role: string,
  permissions: PermissionInfo[] 
) => {  
  if (role in rolesCache) return rolesCache[role];

  const scopes = permissions
    .filter((arr) => arr.role === role)
    .map((arr) => arr.scope);

  rolesCache[role] = scopes;

  return scopes;
}

const sendVerificationEmail = async (
  email: string,
  token: string,
  acceptURL: string
) => {
  const content = renderVerifyEmail({
    email: email,
    acceptURL: `${acceptURL}?token=${token}`
  });

  await sendEmail(
    email, 
    'Kita - Verify your email', 
    content
  );
}