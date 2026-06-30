import { AuthServices } from './auth.services';
import { TokenServices } from '../token/token.services';
import { NextFunction, Request, Response } from 'express';
import { MembershipServices } from '../organization/membership.services';
import { OrganizationService } from '../organization/organization.services';
import { BranchServices } from '../branch/branch.services';
import { UserServices } from './user.services';


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
      const { email, password } = req.body;
  
      const success = await AuthServices
        .signup(email, password);
  
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

      let orgrole = null;
      let orgmemID = null;
      const user = await AuthServices.signin(email, password);

      const session = (
        await TokenServices.createRefreshToken(user!, '7d')
      ) as unknown as { 'id': string };

      if (user?.default_org) {
        const org = await MembershipServices.findRole(
          user.id!,
          user?.default_org
        )
        orgrole = org?.roles[0]?.role;
        orgmemID = org?.id;
      }

      const acsToken = await TokenServices.createAccessToken(
        user!, 
        session.id,
        user?.default_org ?? null,
        orgrole,
        orgmemID
      );

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
      const sessionID = req.user?.sid;

      await AuthServices.logout(sessionID!);

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
}
