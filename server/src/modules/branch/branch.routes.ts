import { Router } from "express";

import * as BranchController from "./branch.controller";
import { requireAuth, requireBrc, requireOrg, verifyBrcPermission } from "@/middleware/auth.middleware";


const branchRouter = Router();

branchRouter.post('/',
  requireAuth,
  requireOrg,
  verifyBrcPermission('insert.brc'),
  BranchController.create
);

branchRouter.get('/members/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.brcmem'),
  BranchController.findMembers
);

branchRouter.get('/:id',
  requireAuth,
  requireOrg,
  verifyBrcPermission('select.brc'),
  BranchController.selectBranch
);

branchRouter.patch('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.brc'),
  BranchController.update
);

branchRouter.patch('/member/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.brcmem'),
  BranchController.updateMember
);

branchRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.brc'),
  BranchController.deleteBranch
);

branchRouter.delete('/member/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.brcmem'),
  BranchController.deleteMember
);

export default branchRouter;