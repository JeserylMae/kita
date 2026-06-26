import { InvalidCredentials } from "@/errors";
import { OrganizationService } from "./organization.services";
import { OrgParams, TableName } from "./organization.types";
import e, { NextFunction, Request, Response } from "express";
import { MembershipServices } from "./membership.services";


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
  
      const data = await MembershipServices
        .findMembership( userID!, { 
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

  public static create(req: Request, res: Response, next: NextFunction) {
    return this.save(req, res, next, 'create');
  }

  public static update(req: Request, res: Response, next: NextFunction) {
    return this.save(req, res, next, 'update');
  }

  
  /**
   * Returns delete handler
   */
  public static deleteFounder = 
    OrganizationController.createDeleteHandler(
      TableName.founder
    );
  
  /**
   * Returns delete handler
   */
  public static deleteBrand = 
    OrganizationController.createDeleteHandler(
      TableName.brand
    );

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
  */
 public static async deleteOrg(
   req: Request,
   res: Response,
   next: NextFunction
  ) {
    try {
      const id = req.params.id;

      if (typeof id !== 'string') {
        throw new InvalidCredentials(
          'Invalid ID.'
        );
      }
  
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
  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @param action 
   * @returns 
   */
  private static async save(
    req: Request,
    res: Response,
    next: NextFunction,
    action: 'create' | 'update'
  ) {
    try {
      let message = "";
      const { organization, brands, founders, membership } = req.body;
      
      if (action === 'create') {
        await OrganizationService.store(
          organization,
          brands,
          founders,
          membership
        );
        message = 'Organization created successfully.';
      } 
      else {
        await OrganizationService.update(
          organization,
          brands,
          founders
        );
        message = 'Organization updated successfully.';
      }
      
      return res.status(200).json({
        "success": true,
        "message": message
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * 
   * @param table 
   * @returns 
   */
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