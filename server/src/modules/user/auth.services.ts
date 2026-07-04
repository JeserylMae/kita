import { hash } from '@node-rs/argon2';
import { supabase } from '@/config/db';
import { v4 as uuidv4 } from "uuid";
import { TokenServices } from '../token/token.services';
import { PermissionInfo } from './user.types';
import { SessionServices } from '../token/sessions.services';
import { AccountNotVerified, ErrorII } from "@/errors";

import * as UserServices from './user.services';
import * as PasswordServices from './password.services';


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
): Promise<boolean> => {
  const hashedPassword = await hash(password);
  
  const success = await UserServices.insert({
    auth_id: uuidv4(),
    email: email, 
    password: hashedPassword
  });

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
  
  await TokenServices.delete(tokenData.id!);

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
  sessionID: string 
) => {
  const session = await SessionServices
    .find(sessionID);

  await SessionServices.delete(session.id!);
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
