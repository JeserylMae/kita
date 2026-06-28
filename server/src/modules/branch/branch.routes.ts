import { Router } from "express";
import { BranchController } from "./branch.controller";


const branchRouter = Router();

branchRouter.put('/',
  BranchController.create
);

branchRouter.get('/member/:id',
  BranchController.findMembers
);

branchRouter.patch('/',
  BranchController.update
);

branchRouter.patch('/member/',
  BranchController.updateMember
);

branchRouter.delete('/:id',
  BranchController.delete
);

branchRouter.delete('/member/:id',
  BranchController.deleteMember
);

export default branchRouter;