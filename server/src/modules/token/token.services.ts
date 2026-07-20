import crypto from 'crypto';
import config from "@/config";
import { UserSelect } from "../user/user.types";
import { supabase } from '@/config/db';
import { getDateAfterInterval } from '@/utils/data.helpers';
import { importPKCS8, importSPKI, jwtVerify, SignJWT } from "jose";
import { ConflictError, ErrorII, InvalidCredentials, RecordNotFound } from '@/errors';

import * as SessionServices from './sessions.services';


export interface Token {
  id?: string;
  user_id?: string;
  token_hash?: string;
  isavailable?: boolean;
  expires_at?: Date;
}

/**
 * 
 * @param authID 
 * @returns 
 */
export const createAccessToken = async ( 
  userID: string,
  sessionID: string,
  orgID: string | null,
  orgRole: string | null,
  orgmemID: string | null,
  verified: boolean,
  branchID?: string | null,
  branchRole?: string | null,
  branchMemID?: string | null,

) => {
  const alg = config.signingAlg;
  const pkcs8 = config.privateKey;

  const pri = await importPKCS8( pkcs8, alg );

  const payload = {
    sub:        userID,
    sid:        sessionID!,
    corg:       orgID,
    orgrole:    orgRole,
    orgmemid:   orgmemID,
    brcid:   branchID,
    brcrole: branchRole,
    brcmemid: branchMemID,
    verified:   verified
  };

  const jwt = await new SignJWT( payload )
    .setProtectedHeader({ alg })
    .setIssuedAt(new Date)
    .setIssuer(config.tokenIss)
    .setAudience(config.tokenAud)
    .setExpirationTime(config.expDuration)
    .sign(pri);

  return jwt;
}

/**
 * 
 * @param user 
 * @param token 
 * @param expDuration 
 * Examples:
 * - "15s"   = 15 seconds
 * - "15min" = 15 minutes
 * - "2h"    = 2 hours
 * - "7d"    = 7 days
 * - "2w"    = 2 weeks
 * - "1m"    1 month
 */
export const createRefreshToken = async ( 
  userID: string, 
  expDuration: string 
) => {
  const refreshToken = createToken();

  const createdAt = new Date();
  const expiresAt = getDateAfterInterval(
    createdAt,
    expDuration
  )

  const session = await SessionServices.insert({
    user_id: userID,
    refresh_token_hash: refreshToken,
    expires_at: expiresAt,
    created_at: createdAt
  }, "id");

  return session[0];
}

/**
 * 
 * @returns 
 */
export const createToken = () => {
  const token = crypto.randomBytes(32).toString();

  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  return hashedToken;
}

/**
 * 
 * @param userID 
 * @param token 
 * @param expires 
 * Examples:
 * - "15s"   = 15 seconds
 * - "15min" = 15 minutes
 * - "2h"    = 2 hours
 * - "7d"    = 7 days
 * - "2w"    = 2 weeks
 * - "1m"    1 month
 * Default: 15min
 */
export const store = async (
  userID: string,
  token: string, 
  expires: string = '15min'
) => {
  const createdAt = new Date();
  const expiresAt = getDateAfterInterval(createdAt, expires);

  const { data, error } = await supabase
    .from('password_reset_tokens')
    .insert({
      'user_id': userID,
      'token_hash': token,
      'expires_at': expiresAt,
      'created_at': createdAt,
    });
  
  if (error) {
    throw new ConflictError(error.message);
  }
}

/**
 * 
 * @param token 
 * @returns 
 */
export const find = async ( token: string ) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token_hash', token)
    .single();

  if (error) {
    throw new RecordNotFound('Token is not valid.');
  }

  delete data['created_at'];

  return data as unknown as Token;
}

/**
 * 
 * @param token 
 */
export const verify = ( token: Token ) => {
  const isExpired = token.expires_at! < new Date();

  if (!token.isavailable) {
    throw new InvalidCredentials('Token already used.');
  }

  if (isExpired) {
    throw new InvalidCredentials('Token already expired.');
  }
}

export const verifyAccessToken = async (token: Token) => {
  const alg = config.signingAlg;
  const spki = config.publicKey;

  const pub = await importSPKI(spki, alg);

  const { payload, protectedHeader } = await jwtVerify(
    token.token_hash!,
    pub, {
      issuer: config.tokenIss,
      audience: config.tokenAud
    }
  );

  return payload;
}

export const setUsed = async ( tokenID: string ) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .update({ 'isavailable': false })
    .eq('id', tokenID);

  if (error) {
    throw new RecordNotFound('Failed to update token.');
  }
}

/**
 * 
 * @param tokenID 
 */
export const deleteToken = async (tokenID: string) => {
  const { data, error } = await supabase
    .from('password_reset_tokens')
    .delete()
    .eq('id', tokenID);
  
  if (error) {
    throw new ErrorII('Failed to delete token.');
  }
}

