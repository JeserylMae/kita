import { Router } from "express";
import * as MovementController from "./movement.controller";
import { verifyPermission, verifyToken } from "@/middleware/auth.middleware";


const movementRouter = Router();

movementRouter.get('/',
  verifyToken,
  verifyPermission('select.'),
  MovementController.get
);

movementRouter.post('/', 
  verifyToken,
  verifyPermission('insert.'),
  MovementController.store
);

movementRouter.patch('/:id',
  verifyToken,
  verifyPermission('update.'),
  MovementController.update
);

movementRouter.delete('/:id',
  verifyToken,
  verifyPermission('delete.'),
  MovementController.deleteMovement
);

export default movementRouter;