import { verifyPermission, verifyToken } from "@/middleware/auth.middleware";
import { Router } from "express";
import { MovementController } from "./movement.controller";


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
  MovementController.delete
);

export default movementRouter;