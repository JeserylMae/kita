import { IdParams } from '../base/base.types';
import { findMembership } from '../branch/branch.services';
import { AuthRequest, BrcRequest } from '@/config/types';

import { 
  Request,
  Response, 
  NextFunction 
} from 'express';
import { 
  InvitationParams, 
  InvitationResponse 
} from '../organization/organization.types';

import * as InvitationServices from './invitation.services';
import { assertAuth, assertBrc } from '../base/base.services';


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
    assertBrc(req);

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
  req: Request<{token: string}, any, InvitationResponse>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const invitation = req.body;
    const token = req.params.token;

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
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const inviteID = req.params.id;
    const { inviteURL } = req.body;

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
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const orgMemID = req.context.org.memID;

    const invitations = await findMembership(
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
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const invID = req.params.id;

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
