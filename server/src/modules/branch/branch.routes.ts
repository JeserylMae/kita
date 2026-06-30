import { Router } from "express";
import { BranchController } from "./branch.controller";
import { verifyToken, verifyPermission } from "@/middleware/auth.middleware";


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
  BranchController.delete
);

branchRouter.delete('/member/:id',
  verifyToken,
  verifyPermission('delete.brcmem'),
  BranchController.deleteMember
);

export default branchRouter;