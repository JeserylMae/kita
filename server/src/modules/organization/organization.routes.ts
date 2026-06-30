import { Router } from "express";
import { OrganizationController } from "./organization.controller";
import { verifyToken, verifyPermission } from "@/middleware/auth.middleware";


const organizationRouter = Router();

organizationRouter.get('/memberships',
  verifyToken,
  verifyPermission('select.orgmem'),
  OrganizationController.getOrganizations
);

organizationRouter.get('/:orgID',
  verifyToken,
  verifyPermission('select.orgmem'),
  OrganizationController.getMembers
);

organizationRouter.post('/',
  verifyToken,
  OrganizationController.create
);

organizationRouter.patch('/',
  verifyToken,
  verifyPermission('update.org'),
  OrganizationController.update
)

organizationRouter.patch('/member',
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

organizationRouter.delete('/:id',
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