import { Router } from "express";
import * as MovementController from "./movement.controller";

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
  MovementInsertSchema, 
  MovementUpdateSchema 
} from "./movement.schemas";


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
  validateBody(MovementInsertSchema),
  MovementController.store
);

movementRouter.patch('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.invtmov'),
  validateIdParams,
  validateBody(MovementUpdateSchema),
  MovementController.update
);

movementRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.invtmov'),
  validateIdParams,
  MovementController.deleteMovement
);

export default movementRouter;