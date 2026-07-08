import { Router } from "express";
import * as MovementController from "./movement.controller";
import { 
  requireAuth, 
  requireBrc, 
  requireOrg, 
  verifyBrcPermission 
} from "@/middleware/auth.middleware";


const movementRouter = Router();

movementRouter.get('/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.invtmov'),
  MovementController.get
);

movementRouter.post('/', 
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('insert.invtmov'),
  MovementController.store
);

movementRouter.patch('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.invtmov'),
  MovementController.update
);

movementRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.invtmov'),
  MovementController.deleteMovement
);

export default movementRouter;