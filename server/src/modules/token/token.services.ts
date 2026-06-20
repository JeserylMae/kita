import crypto from 'crypto';
import config from "@/config";
import { User } from "../user/user.services";
import { supabase } from '@/config/db';
import { ConflictError, ErrorII, InvalidCredentials, RecordNotFound } from '@/errors';
import { importPKCS8, SignJWT } from "jose";
import { getDateAfterInterval, sanitizeObject } from '@/utils/data.helpers';
import { SessionServices } from './sessions.services';


export interface Token {
  id?: string;
  user_id?: string;
  token_hash?: string;
  isavailable?: boolean;
  expires_at?: Date;
}

export class TokenServices {
  /**
   * 
   * @param authID 
   * @returns 
   */
  public static async createAccessToken( user: User ) {
    const alg = config.signingAlg;
    const pkcs8 = config.privateKey;
  
    const pri = await importPKCS8( pkcs8, alg );
  
    const payload = {
      sub:       user.id!,
      roleID:    user.role_id!,
      // orgIDs:    user.orgID,
      // branchIDs: user.branchID,
      verified:  user.verified_at ? true : false,
    };
  
    const jwt = await new SignJWT( payload )
      .setProtectedHeader({ alg })
      .setIssuedAt()
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
  public static async createRefreshToken( 
    user: User, 
    expDuration: string 
  ) {
    const refreshToken = TokenServices.createToken();

    const createdAt = new Date();
    const expiresAt = getDateAfterInterval(
      createdAt,
      expDuration
    )

    await SessionServices.insert({
      user_id: user!.id!,
      refresh_token_hash: refreshToken,
      expires_at: expiresAt,
      created_at: createdAt
    });
  }

  /**
   * 
   * @returns 
   */
  public static createToken() {
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
  public static async store(
    userID: string,
    token: string, 
    expires: string = '15min'
  ) {
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
  public static async find( token: string ) {
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
  public static verify( token: Token ) {
    const isExpired = new Date(token.expires_at!) < new Date();

    if (!token.isavailable) {
      throw new InvalidCredentials('Token already used.');
    }

    if (isExpired) {
      throw new InvalidCredentials('Token already expired.');
    }
  }

  public static async setUsed( tokenID: string ) {
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
  public static async delete(tokenID: string) {
    const { data, error } = await supabase
      .from('password_reset_tokens')
      .delete()
      .eq('id', tokenID);
    
    if (error) {
      throw new ErrorII('Failed to delete token.');
    }
  }
}
