import { InvalidCredentials } from "@/errors";
import { OrganizationService } from "./organization.services";
import { OrgParams, TableName } from "./organization.types";
import { NextFunction, Request, Response } from "express";


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

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async createOrganization(
    req: Request<any, any, OrgParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const params = req.body;

      await OrganizationService.save(params);

      res.status(201).json({
        'success': true,
        'message': 'Organization information saved.'
      });
    }
    catch (error: unknown) {
      if (error instanceof Error) console.log(error.message);
      next(error);
    }
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