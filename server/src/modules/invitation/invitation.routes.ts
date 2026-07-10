import { Router } from "express";
import * as InvitationController from "./invitation.controller";

import { 
  requireAuth, 
  requireBrc, 
  requireOrg, 
  verifyBrcPermission 
} from "@/middleware/auth.middleware";

import { 
  validateBody, 
  validateIdParams 
} from "@/middleware/validation.middleware";

import { 
  InvitationParamsSchema, 
  InvitationResponseSchema 
} from "../organization/organization.schemas";


const invitationRouter = Router();

// /invitation/
invitationRouter.post('/', 
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('insert.orginv'),
  validateIdParams,
  validateBody(InvitationParamsSchema),
  InvitationController.invite
);

// /invitation/tokenstr
invitationRouter.post('/:token', 
  requireAuth,
  validateBody(InvitationResponseSchema),
  InvitationController.respondToInvitation
);

// /invitation/idstr
invitationRouter.post('/:id',
  requireAuth,
  validateIdParams,
  InvitationController.reinvite
);

// /invitation/idstr
invitationRouter.get('/me',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.orginv'),
  validateIdParams,
  InvitationController.getInvitations
);

// /invitation/idstr
invitationRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.orginv'),
  validateIdParams,
  InvitationController.deleteInvitation
);

export default invitationRouter;