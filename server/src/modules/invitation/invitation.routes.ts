import { Router } from "express";
import * as InvitationController from "./invitation.controller";


const invitationRouter = Router();

// /invitation/
invitationRouter.post('/', 
  InvitationController.invite
);

// /invitation/tokenstr
invitationRouter.post('/:token', 
  InvitationController.respondToInvitation
);

// /invitation/idstr
invitationRouter.post('/:id',
  InvitationController.reinvite
);

// /invitation/idstr
invitationRouter.get('/:id',
  InvitationController.getInvitations
);

// /invitation/idstr
invitationRouter.delete('/:id',
  InvitationController.deleteInvitation
);

export default invitationRouter;