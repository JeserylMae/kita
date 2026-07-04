import { BranchServices } from '../branch/branch.services';
import { InvalidCredentials } from '@/errors';

import { 
  Request, 
  Response, 
  NextFunction 
} from 'express';
import { 
  InvitationParams, 
  InvitationResponseParams 
} from '../organization/organization.types';

import * as InvitationServices from './invitation.services';


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const invite = async (
  req: Request<any, any, InvitationParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const invitation  = req.body;

    await InvitationServices.createInvitation(invitation);

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
export const respondToInvitation = async (
  req: Request<any, any, InvitationResponseParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    const invitation = req.body;
    const token = req.params.token;

    if (typeof token !== 'string') {
      throw new InvalidCredentials('Invalid token');
    }

    await InvitationServices.respond( 
      invitation, token
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
export const reinvite = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
export const getInvitations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgMemID = req.params.id;

    if (typeof orgMemID !== 'string') {
      throw new InvalidCredentials(
        'Invalid organization member id.'
      );
    }

    const invitations = await BranchServices.findMembership(
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

export const deleteInvitation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const invID = req.params.id;

    if (typeof invID !== 'string') {
      throw new InvalidCredentials(
        'Invitation ID is not valid.'
      );
    }

    await InvitationServices.deleteInvitation(invID);

    res.status(200).json({
      'success': true,
      'message': 'Invitation was deleted.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}
