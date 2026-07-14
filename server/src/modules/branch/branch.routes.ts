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
import { authorizeBranchAccess } from "@/middleware/authorization.middleware";


const brcMiddlewares = (scope: string) => {
  return [
    requireBrc,
    verifyBrcPermission(scope),
    authorizeBranchAccess,
    validateIdParams
  ];
}


const branchRouter = Router();

branchRouter.use(requireAuth);
branchRouter.use(requireOrg);

branchRouter.post('/',
  verifyBrcPermission('insert.brc'),
  BranchController.create
);

branchRouter.get('/members/',
  requireBrc,
  verifyBrcPermission('select.brcmem'),
  authorizeBranchAccess,
  BranchController.findMembers
);

branchRouter.get('/:id',
  verifyBrcPermission('select.brc'),
  authorizeBranchAccess,
  validateIdParams,
  BranchController.selectBranch
);

branchRouter.patch('/:id',
  ...brcMiddlewares('update.brc'),
  validateBody(BranchUpdateSchema),
  BranchController.update
);

branchRouter.patch('/member/:id',
  ...brcMiddlewares('update.brcmem'),
  validateBody(MemberUpdateSchema),
  BranchController.updateMember
);

branchRouter.delete('/:id',
  ...brcMiddlewares('delete.brc'),
  BranchController.deleteBranch
);

branchRouter.delete('/member/:id',
  ...brcMiddlewares('delete.brcmem'),
  BranchController.deleteMember
);

export default branchRouter;