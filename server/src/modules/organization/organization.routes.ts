import { Router } from "express";
import { UserMiddleware } from "../user/user.middleware";
import { OrganizationController } from "./organization.controller";


const organizationRouter = Router();

organizationRouter.get('/memberships',
  UserMiddleware.attachUser,
  OrganizationController.getOrganizations
);

organizationRouter.get('/:orgID',
  OrganizationController.getMembers
);

organizationRouter.post('/',
  OrganizationController.create
);

organizationRouter.patch('/',
  OrganizationController.update
)

organizationRouter.patch('/member',
  OrganizationController.updateMember
);

organizationRouter.delete('/founder/:id',
  OrganizationController.deleteFounder
);

organizationRouter.delete('/brand/:id',
  OrganizationController.deleteBrand
);

organizationRouter.delete('/:id',
  OrganizationController.deleteOrg
);

organizationRouter.delete('/member/:id',
  OrganizationController.deleteMember
);

export default organizationRouter;