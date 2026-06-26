import { Router } from "express";
import { InvitationController } from "./invitation.controller";


const invitationRouter = Router();

invitationRouter.post('/', 
  InvitationController.invite
);

invitationRouter.post('/:token', 
  InvitationController.respondToInvitation
);

export default invitationRouter;