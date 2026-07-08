import { Router } from "express";
import { verifyToken, verifyPermission } from "@/middleware/auth.middleware";

import * as OrganizationController from "./organization.controller";


const organizationRouter = Router();

organizationRouter.get('/memberships/me',
  verifyToken,
  verifyPermission('select.orgmem'),
  OrganizationController.getOrganizations
);

organizationRouter.get('/:id',
  verifyToken,
  verifyPermission('select.orgmem'),
  OrganizationController.getMembers
);

organizationRouter.get('/switch/:id', 
  verifyToken,
  OrganizationController.switchOrganization
);

organizationRouter.post('/',
  verifyToken,
  OrganizationController.create
);

organizationRouter.patch('/:id',
  verifyToken,
  verifyPermission('update.org'),
  OrganizationController.update
)

organizationRouter.patch('/:orgID/member/:id',
  verifyToken,
  verifyPermission('update.orgmem'),
  OrganizationController.updateMember
);

organizationRouter.delete('/founder/:id',
  verifyToken,
  verifyPermission('delete.org'),
  OrganizationController.deleteFounder
);

organizationRouter.delete('/brand/:id',
  verifyToken,
  verifyPermission('delete.org'),
  OrganizationController.deleteBrand
);

organizationRouter.delete('/',
  verifyToken,
  verifyPermission('delete.org'),
  OrganizationController.deleteOrg
);

organizationRouter.delete('/member/:id',
  verifyToken,
  verifyPermission('delete.orgmem'),
  OrganizationController.deleteMember
);

export default organizationRouter;