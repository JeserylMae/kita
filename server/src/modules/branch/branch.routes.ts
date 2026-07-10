import { Router } from "express";

import * as BranchController from "./branch.controller";

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
  BranchUpdateSchema, 
  MemberUpdateSchema 
} from "./branch.schemas";


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
  validateIdParams,
  BranchController.selectBranch
);

branchRouter.patch('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.brc'),
  validateIdParams,
  validateBody(BranchUpdateSchema),
  BranchController.update
);

branchRouter.patch('/member/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('update.brcmem'),
  validateIdParams,
  validateBody(MemberUpdateSchema),
  BranchController.updateMember
);

branchRouter.delete('/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.brc'),
  validateIdParams,
  BranchController.deleteBranch
);

branchRouter.delete('/member/:id',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('delete.brcmem'),
  validateIdParams,
  BranchController.deleteMember
);

export default branchRouter;