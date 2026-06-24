import { NextFunction, Request, Response } from "express";
import { OrganizationService } from "./organization.services";
import { Invitation } from "./organization.types";
import { InvitationServices } from "./invitation.services";


export class OrganizationController {
  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async getOrganizations(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userID = req.user?.id; 
      const withBranches = req.query.withBranches === 'true';
      const defaultOrgOnly = req.query.defaultOrgOnly === 'true';
  
      const data = await OrganizationService
        .getOrganizations( userID!, { 
          withBranches,
          defaultOrgOnly 
        });

      res.status(201).json({
        "success": true,
        "message": "Successfully fetched organizations and branches.",
        "data": data
      })
    }
    catch ( error: unknown ) {
      next(error);
    }
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async invite(
    req: Request<any, any, Invitation>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const senderID = req.user?.id;
      const invitation  = req.body;

      InvitationServices.createInvitation(
        senderID!, 
        invitation
      );
    }
    catch ( error: unknown ) {
      next(error);
    }
  }
}