import { NextFunction, Request, Response } from "express";
import { OrganizationService } from "./organization.services";
import { Invitation, OrgParams, TableName } from "./organization.types";
import { InvitationServices } from "./invitation.services";
import { table } from "node:console";


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
        .find( userID!, { 
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

  public static async createOrganization(
    req: Request<any, any, OrgParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const params = req.body;

    }
    catch (error: unknown) {
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

      res.status(201).json({
        'success': true,
        'message': 'Invitation sent.'
      });
    }
    catch ( error: unknown ) {
      next(error);
    }
  }

  public static async respondToInvitation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { receiverEmail, inviteID, status, token } = req.body;

      await InvitationServices.respond( 
        receiverEmail, 
        inviteID, 
        status, 
        token 
      );

      res.status(201).json({
        'success': true,
        'message': 'Re-invitation sent.'
      });
    }
    catch ( error: unknown ) {
      next(error);
    }
  }

  public static deleteFounder = 
    OrganizationController.createDeleteHandler(
      TableName.founder
    );
  
  public static deleteBrand = 
    OrganizationController.createDeleteHandler(
      TableName.brand
    );

  public static async deleteOrg(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.body;
  
      await OrganizationService.deleteOrg(id);

      res.status(200).json({
        'success': true,
        'message': 'Deletion successful.'
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }

  private static createDeleteHandler(
    table: TableName
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      const { id } = req.body;

      await OrganizationService.deleteHandler(
        id,
        table,
        res,
        next
      );
    };
  }
}