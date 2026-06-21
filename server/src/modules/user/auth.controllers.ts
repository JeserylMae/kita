import { decodeJwt } from 'jose';
import { AuthServices } from './auth.services';
import { TokenServices } from '../token/token.services';
import { NextFunction, Request, Response } from 'express';
import { InvalidCredentials } from '@/errors';


export default class AuthController {
  /**
   * 
   * @param req 
   * @param res 
   * @returns 
   */
  public static async signup( 
    req: Request, 
    res: Response,
    next: NextFunction 
  ) {
    try {
      const { email, password, role } = req.body;
  
      const success = await AuthServices
        .signup(email, password, role);
  
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
  public static async signin( 
    req: Request, 
    res: Response,
    next: NextFunction 
  ) {
    try {
      const { email, password } = req.body;

      const user = await AuthServices.signin(email, password);
      const acsToken = await TokenServices.createAccessToken(user!);
      await TokenServices.createRefreshToken(user!, '7d');

      res.cookie('ACCESS-TOKEN', acsToken, {
        httpOnly: true,
        secure: true, 
        sameSite: 'strict'
      })
      .status(200)
      .json({
        'success': true,
        'message': 'Login successful',
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
  public static async requestForgotPassword( 
    req: Request, 
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, resetClientLink } = req.body;

      await AuthServices.requestforgotPassword( email, resetClientLink );

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
  public static async resetPassword(
    req: Request, 
    res: Response,
    next: NextFunction
  ) {
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
  public static async logout( 
    req: Request, 
    res: Response,
    next: NextFunction
  ) {
    try {
      const acsToken = req.cookies['ACCESS-TOKEN'];

      if (!acsToken) {
        throw new InvalidCredentials('Access token not found.');
      }
      
      const claims = decodeJwt(acsToken);

      if (!claims || !claims.sub) {
        throw new InvalidCredentials('Subject ID not found.');
      }

      await AuthServices.logout(claims.sub);

      res.status(200).json({
        success: true,
        message: 'Logout successful.',
      });
    }
    catch ( error: unknown ) {
      next(error);
    }
  }
}
