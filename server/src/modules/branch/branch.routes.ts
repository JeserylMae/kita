import { Router } from "express";
import { verifyToken, verifyPermission } from "@/middleware/auth.middleware";

import * as BranchController from "./branch.controller";


const branchRouter = Router();

branchRouter.put('/',
  verifyToken,
  verifyPermission('insert.brc'),
  BranchController.create
);

branchRouter.get('/member/:id',
  verifyToken,
  verifyPermission('select.brcmem'),
  BranchController.findMembers
);

branchRouter.get('/',
  verifyToken,
  BranchController.selectBranch
);

branchRouter.patch('/',
  verifyToken,
  verifyPermission('update.brc'),
  BranchController.update
);

branchRouter.patch('/member/',
  verifyToken,
  verifyPermission('update.brcmem'),
  BranchController.updateMember
);

branchRouter.delete('/:id',
  verifyToken,
  verifyPermission('delete.brc'),
  BranchController.deleteBranch
);

branchRouter.delete('/member/:id',
  verifyToken,
  verifyPermission('delete.brcmem'),
  BranchController.deleteMember
);

export default branchRouter;