import { Router } from "express";
import { UserMiddleware } from "../user/user.middleware";
import { OrganizationController } from "./organization.controller";


const organizationRouter = Router();

organizationRouter.get(
  '/',
  UserMiddleware.attachUser,
  OrganizationController.getOrganizations
);


export default organizationRouter;