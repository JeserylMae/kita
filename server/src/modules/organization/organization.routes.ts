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


const orgMiddlewares = [
  requireOrg,
  verifyOrgPermission,
  validateIdParams
];

const organizationRouter = Router();

organizationRouter.use(requireAuth);

organizationRouter.get('/memberships/me',
  OrganizationController.getOrganizations
);

organizationRouter.get('/:id',
  requireOrg,
  verifyOrgPermission,
  OrganizationController.getMembers
);

organizationRouter.get('/switch/:id', 
  validateIdParams,
  OrganizationController.switchOrganization
);

organizationRouter.post('/',
  validateBody(OrgInsertRequestSchema),
  OrganizationController.create
);

organizationRouter.patch('/:id',
  requireOrg,
  verifyOrgPermission,
  validateBody(OrgUpdateRequestSchema),
  OrganizationController.update
)

organizationRouter.patch('/:orgID/member/:id',
  ...orgMiddlewares,
  validateBody(MembershipUpdateSchema),
  OrganizationController.updateMember
);

organizationRouter.delete('/founder/:id',
  ...orgMiddlewares,
  OrganizationController.deleteFounder
);

organizationRouter.delete('/brand/:id',
  ...orgMiddlewares,
  OrganizationController.deleteBrand
);

organizationRouter.delete('/',
  requireOrg,
  verifyOrgPermission,
  OrganizationController.deleteOrg
);

organizationRouter.delete('/member/:id',
  ...orgMiddlewares,
  OrganizationController.deleteMember
);

export default organizationRouter;