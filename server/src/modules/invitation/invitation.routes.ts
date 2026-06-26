import { Router } from "express";
import { InvitationController } from "./invitation.controller";


const invitationRouter = Router();

invitationRouter.post('/', 
  InvitationController.invite
);

invitationRouter.post('/:token', 
  InvitationController.respondToInvitation
);

invitationRouter.post('/:id',
  InvitationController.reinvite
);

invitationRouter.get('/:id',
  InvitationController.getInvitations
);

export default invitationRouter;