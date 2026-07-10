import { Router } from "express";
import * as ItemsController from "./items.controller";

import { 
  validateBody, 
  validateIdParams 
} from "@/middleware/validation.middleware";

import { 
  ItemInsertSchema, 
  ItemUpdateSchema 
} from "./items.schemas";

import { 
  requireAuth, 
  requireBrc, 
  requireOrg, 
  verifyBrcPermission 
} from "@/middleware/auth.middleware";


const itemRouter = Router();

itemRouter.post('/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('insert.invtitm'),
  validateBody(ItemInsertSchema),
  ItemsController.create
);

itemRouter.get('/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.invtitm'),
  ItemsController.get
);

itemRouter.patch('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.invtitm'),
  validateIdParams,
  validateBody(ItemUpdateSchema),
  ItemsController.update
);

itemRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.invtitm'),
  validateIdParams,
  ItemsController.deletItem
);

export default itemRouter;