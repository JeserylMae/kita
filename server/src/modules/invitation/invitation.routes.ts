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


const inviteMiddlewares = (scope: string) => {
  return [
    requireOrg,
    requireBrc,
    verifyBrcPermission(scope),
    validateIdParams
  ];
}

const invitationRouter = Router();

invitationRouter.use(requireAuth);


// /invitation/
invitationRouter.post('/',
  ...inviteMiddlewares('insert.orginv'),
  validateBody(InvitationParamsSchema),
  InvitationController.invite
);

// /invitation/tokenstr
invitationRouter.post('/:token', 
  validateBody(InvitationResponseSchema),
  InvitationController.respondToInvitation
);

// /invitation/idstr
invitationRouter.post('/:id',
  validateIdParams,
  InvitationController.reinvite
);

// /invitation/idstr
invitationRouter.get('/me',
  ...inviteMiddlewares('select.orginv'),
  InvitationController.getInvitations
);

// /invitation/idstr
invitationRouter.delete('/:id',
  ...inviteMiddlewares('delete.orginv'),
  InvitationController.deleteInvitation
);

export default invitationRouter;