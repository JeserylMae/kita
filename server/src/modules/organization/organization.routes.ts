import { Router } from "express";
import { UserMiddleware } from "../user/user.middleware";
import { OrganizationController } from "./organization.controller";


const organizationRouter = Router();

organizationRouter.get(
  '/organizations',
  UserMiddleware.attachUser,
  OrganizationController.getOrganizations
);

organizationRouter.post('/invite', OrganizationController.invite);


export default organizationRouter;