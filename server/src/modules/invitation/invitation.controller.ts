import { BranchServices } from '../branch/branch.services';
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

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async reinvite(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const inviteID = req.params.id;
      const { inviteURL } = req.body;

      if (typeof inviteID !== 'string') {
        throw new InvalidCredentials(
          'Invalid invitation ID.'
        );
      }
  
      await InvitationServices.reInvite(
        inviteID,
        inviteURL
      );

      res.status(201).json({
        'success': true,
        'message': 'Invitation sent.'
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
   * @param next 
   */
  public static async getInvitations (
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgMemID = req.params.id;
  
      if (typeof orgMemID !== 'string') {
        throw new InvalidCredentials(
          'Invalid organization member id.'
        );
      }
  
      const invitations = BranchServices.findMembership(
        orgMemID,
        'org_mem_id',
        false
      );

      res.status(200).json({
        'success': true,
        'message': 'Invitations retrieved successfully.',
        'invitations': invitations
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }
}