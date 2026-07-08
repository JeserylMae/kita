import { Router } from "express";
import * as InvitationController from "./invitation.controller";
import { requireAuth, requireBrc, requireOrg, verifyBrcPermission } from "@/middleware/auth.middleware";


const invitationRouter = Router();

// /invitation/
invitationRouter.post('/', 
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('insert.orginv'),
  InvitationController.invite
);

// /invitation/tokenstr
invitationRouter.post('/:token', 
  requireAuth,
  InvitationController.respondToInvitation
);

// /invitation/idstr
invitationRouter.post('/:id',
  requireAuth,
  InvitationController.reinvite
);

// /invitation/idstr
invitationRouter.get('/me',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.orginv'),
  InvitationController.getInvitations
);

// /invitation/idstr
invitationRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.orginv'),
  InvitationController.deleteInvitation
);

export default invitationRouter;