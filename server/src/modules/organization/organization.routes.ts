import { Router } from "express";
import { UserMiddleware } from "../user/user.middleware";
import { OrganizationController } from "./organization.controller";


const organizationRouter = Router();

organizationRouter.get('/',
  UserMiddleware.attachUser,
  OrganizationController.getOrganizations
);

organizationRouter.post('/',
  OrganizationController.createOrganization
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

export default organizationRouter;