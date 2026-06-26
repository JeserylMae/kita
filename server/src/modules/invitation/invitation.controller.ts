import { Invitation } from '../organization/organization.types';
import { InvitationServices } from './invitation.services';
import { InvalidCredentials } from '@/errors';
import { Request, Response, NextFunction } from 'express';


export class InvitationController {
  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async invite(
    req: Request<any, any, Invitation>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const senderID = req.user?.id;
      const invitation  = req.body;

      InvitationServices.createInvitation(
        senderID!, 
        invitation
      );

      res.status(201).json({
        'success': true,
        'message': 'Invitation sent.'
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
   * @param next 
   */
  public static async respondToInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { receiverEmail, inviteID, status } = req.body;
      const token = req.params.token;

      if (typeof token !== 'string') {
        throw new InvalidCredentials('Invalid token');
      }

      await InvitationServices.respond( 
        receiverEmail, 
        inviteID, 
        status, 
        token
      );

      res.status(201).json({
        'success': true,
        'message': 'Re-invitation sent.'
      });
    }
    catch ( error: unknown ) {
      next(error);
    }
  }

  // @TODO: Get invite list
}