import { Router } from "express";

import * as OrganizationController from "./organization.controller";

import { 
  requireAuth, 
  requireOrg, 
  verifyOrgPermission 
} from "@/middleware/auth.middleware";

import { 
  validateBody, 
  validateIdParams 
} from "@/middleware/validation.middleware";

import { 
  MembershipUpdateSchema, 
  OrgInsertRequestSchema, 
  OrgUpdateRequestSchema 
} from "./organization.schemas";


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
  validateIdParams,
  OrganizationController.switchOrganization
);

organizationRouter.post('/',
  requireAuth,
  validateBody(OrgInsertRequestSchema),
  OrganizationController.create
);

organizationRouter.patch('/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateBody(OrgUpdateRequestSchema),
  OrganizationController.update
)

organizationRouter.patch('/:orgID/member/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  validateBody(MembershipUpdateSchema),
  OrganizationController.updateMember
);

organizationRouter.delete('/founder/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  OrganizationController.deleteFounder
);

organizationRouter.delete('/brand/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
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
  validateIdParams,
  OrganizationController.deleteMember
);

export default organizationRouter;