import { Router } from "express";
import { verifyToken, verifyPermission } from "@/middleware/auth.middleware";
import * as ItemsController from "./items.controller";


const itemRouter = Router();

itemRouter.post('/',
  verifyToken,
  verifyPermission('insert.invtitm'),
  ItemsController.create
);

itemRouter.get('/',
  verifyToken,
  verifyPermission('select.invtitm'),
  ItemsController.get
);

itemRouter.patch('/:id',
  verifyToken,
  verifyPermission('update.invtitm'),
  ItemsController.update
);

itemRouter.delete('/:id',
  verifyToken,
  verifyPermission('delete.invtitm'),
  ItemsController.deletItem
);

export default itemRouter;