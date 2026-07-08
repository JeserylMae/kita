import { Router } from "express";
import * as ItemsController from "./items.controller";
import { requireAuth, requireBrc, requireOrg, verifyBrcPermission } from "@/middleware/auth.middleware";


const itemRouter = Router();

itemRouter.post('/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('insert.invtitm'),
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
  ItemsController.update
);

itemRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.invtitm'),
  ItemsController.deletItem
);

export default itemRouter;