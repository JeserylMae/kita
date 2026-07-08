import { Router } from "express";

import * as OrganizationController from "./organization.controller";
import { requireAuth, requireOrg, verifyOrgPermission } from "@/middleware/auth.middleware";


const organizationRouter = Router();

organizationRouter.get('/memberships/me',
  requireAuth,
  OrganizationController.getOrganizations
);

organizationRouter.get('/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.getMembers
);

organizationRouter.get('/switch/:id', 
  requireAuth,
  OrganizationController.switchOrganization
);

organizationRouter.post('/',
  requireAuth,
  OrganizationController.create
);

organizationRouter.patch('/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.update
)

organizationRouter.patch('/:orgID/member/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.updateMember
);

organizationRouter.delete('/founder/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.deleteFounder
);

organizationRouter.delete('/brand/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.deleteBrand
);

organizationRouter.delete('/',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.deleteOrg
);

organizationRouter.delete('/member/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  OrganizationController.deleteMember
);

export default organizationRouter;