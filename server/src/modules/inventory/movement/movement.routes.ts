import { Router } from "express";
import { invtMiddlewares } from "../common/inventory.middlewares";

import * as MovementController from "./movement.controller";

import { 
  requireAuth, 
  requireBrc, 
  requireOrg
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

movementRouter.use(requireAuth);
movementRouter.use(requireOrg);
movementRouter.use(requireBrc);

movementRouter.get('/',
  ...invtMiddlewares('select.invtmov'),
  MovementController.get
);

movementRouter.post('/', 
  ...invtMiddlewares('insert.invtmov'),
  validateBody(MovementInsertSchema),
  MovementController.store
);

movementRouter.patch('/:id',
  ...invtMiddlewares('update.invtmov'),
  validateIdParams,
  validateBody(MovementUpdateSchema),
  MovementController.update
);

movementRouter.delete('/:id',
  ...invtMiddlewares('delete.invtmov'),
  validateIdParams,
  MovementController.deleteMovement
);

export default movementRouter;