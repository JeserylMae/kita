import { Router } from "express";
import { invtMiddlewares } from "../inventory.middlewares";

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
  requireOrg
} from "@/middleware/auth.middleware";


const itemRouter = Router();

itemRouter.use(requireAuth);
itemRouter.use(requireOrg);
itemRouter.use(requireBrc);

itemRouter.post('/',
  ...invtMiddlewares('insert.invtitm'),
  validateBody(ItemInsertSchema),
  ItemsController.create
);

itemRouter.get('/',
  ...invtMiddlewares('select.invtitm'),
  ItemsController.get
);

itemRouter.patch('/:id',
  ...invtMiddlewares('update.invtitm'),
  validateIdParams,
  validateBody(ItemUpdateSchema),
  ItemsController.update
);

itemRouter.delete('/:id',
  ...invtMiddlewares('delete.invtitm'),
  validateIdParams,
  ItemsController.deletItem
);

export default itemRouter;