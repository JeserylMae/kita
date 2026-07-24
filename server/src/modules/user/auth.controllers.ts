import { assertAuth } from '../base/base.services';
import { InvalidCredentials } from '@/errors';
import { accessTokenCookieOptions } from '@/config/types.d';
import { NextFunction, Request, Response } from 'express';

import * as TokenServices from '../token/token.services';
import * as AuthServices from './auth.services';
import * as MembershipServices from '../organization/membership.services';

import { 
  ForgotPasswordParams, 
  ResetPasswordParams, 
  SigninParams, 
  SignupParams 
} from './user.types';
import { stringOrNull } from '@/utils/data.helpers';


/**
 * 
 * @param req 
 * @param res 
 * @returns 
 */
export const signup = async ( 
  req: Request<any, any, SignupParams>, 
  res: Response,
  next: NextFunction 
) => {
  try {
    const { email, password, url } = req.body;

    const success = await AuthServices
      .signup(email, password, url);

    return res.status(201).json({ 
      'success': success,
      'authenticated': true,
    });
  }
  catch ( error: unknown ) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 */
export const signin = async ( 
  req: Request<any, any, SigninParams>, 
  res: Response,
  next: NextFunction 
) => {
  try {
    const { email, password } = req.body;

    let orgrole = null;
    let orgmemID = null;
    const user = await AuthServices.signin(email, password);

    const session = (
      await TokenServices.createRefreshToken(user?.id!, '7d')
    ) as unknown as { 'id': string };

    // If user has default org, then assign the 
    // orgID, memberID and role to access token's claims 
    if (user?.id && user?.default_org) {
      const org = await MembershipServices.findRole(
        user.id, 
        user.default_org
      );

      orgrole = org?.role;
      orgmemID = org?.id;
    }

    const acsToken = await TokenServices.createAccessToken(
      user?.id!, 
      session.id,
      user?.default_org ?? null,
      orgrole,
      orgmemID,
      user?.verified_at? true : false
    );

    res.cookie('ACCESS-TOKEN', acsToken, 
      accessTokenCookieOptions
    ).status(200)
    .json({
      'success': true,
      'message': 'Login successful',
    });
  }
  catch ( error: unknown ) {
    next(error);
  }
}

export const verifyEmail = async (
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body;
    const token = req.query.token;

    if (typeof token !== 'string') {
      throw new InvalidCredentials('Invalid token');
    }

    await AuthServices.verifyEmail(email, token);

    res.status(200).json({
      'success': true,
      'message': 'If an unverified account exists for ' +
        'this email a verification email has been sent.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const resendEmailVerification = async (
  req: Request<any, any, ForgotPasswordParams>, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, url} = req.body;

    await AuthServices.resendVerificationEmail(email, url);

    res.status(200).json({
      'success': true,
      'message': 'If an unverified account exists for ' +
        'this email a new verification email has been sent.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 */
export const requestForgotPassword = async ( 
  req: Request<any, any, ForgotPasswordParams>, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, url } = req.body;

    await AuthServices.requestforgotPassword( email, url );

    res.status(202).json({
      'success': true,
      'message': 'Email sent',
    });
  }
  catch ( error: unknown ) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 */
export const resetPassword = async (
  req: Request<any, any, ResetPasswordParams>, 
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, token, newPassword } = req.body;

    const success = await AuthServices
      .resetPassword(email, token, newPassword);

    res.status(201).json({
      'success': success,
      'message': 'Password changed.',
    })
  }
  catch ( error: unknown ) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const logout = async ( 
  req: Request, 
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);
    
    const sessionID = req.context.user.sid;
    const userID = req.context.user.id;

    await AuthServices.logout(sessionID, userID);

    res.clearCookie('ACCESS-TOKEN');
    res.status(200).json({
      success: true,
      message: 'Logout successful.',
    });
  }
  catch ( error: unknown ) {
    next(error);
  }
}

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);
    const userID = req.context.user.id;
    const sessionID = req.context.user.sid;
    const claims = req.context.user.claims;

    const acstoken = await AuthServices.refresh(
      userID,
      sessionID,
      stringOrNull(claims.corg),
      stringOrNull(claims.orgrole),
      stringOrNull(claims.orgmemid),
      stringOrNull(claims.brcid),
      stringOrNull(claims.brcrole),
      stringOrNull(claims.brcmemid)
    );

    res.cookie('ACCESS-TOKEN', acstoken, 
      accessTokenCookieOptions
    ).status(200)
    .json({
      'success': true,
      'message': 'Refresh successful.',
    });    
  }
  catch (error: unknown) {
    next(error);
  }
}
