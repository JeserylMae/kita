import { InvalidCredentials } from "@/errors";
import { OrganizationService } from "./organization.services";
import { OrgMembershipParams, OrgParams, TableName } from "./organization.types";
import e, { NextFunction, Request, Response } from "express";
import { MembershipServices } from "./membership.services";
import { canAccessUser } from "../base/base.services";


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
      const pscope = req.scopes;
      const withBranches = req.query.withBranches === 'true';
      const defaultOrgOnly = req.query.defaultOrgOnly === 'true';

      if (!canAccessUser(pscope)) return;
  
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

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async getMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgID = req.params.orgID;
      const pscope = req.scopes;

      if (!canAccessUser(pscope)) return;

      if (typeof orgID !== 'string') {
        throw new InvalidCredentials(
          'Organization ID must be string.'
        );
      }

      const data = await MembershipServices
        .findAllMembers(orgID);
      
      res.status(200).json({
        "success": true,
        "message": "Organization members are retrieved.",
        "orgMembers": data
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
   * @returns 
   */
  public static create(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    return this.save(req, res, next, 'create');
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  public static update(
    req: Request, 
    res: Response, 
    next: NextFunction
  ) {
    return this.save(req, res, next, 'update');
  }

  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   */
  public static async updateMember(
    req: Request<any, any, OrgMembershipParams>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pscope = req.scopes;
      const member = req.body;

      if (!canAccessUser(pscope)) return;
  
      await MembershipServices.update(member);
  
      res.status(201).json({
        'success': true,
        'message': 'Member information was updated.'
      });
    }
    catch(error: unknown) {
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
      const pscope = req.scopes;
      const id = req.params.id;

      if (!canAccessUser(pscope)) return;

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
   */
  public static async deleteMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pscope = req.scopes;
      const memberID = req.params.id;

      if (!canAccessUser(pscope)) return;

      await MembershipServices.delete(memberID);
      
      res.status(200).json({
        'success': true,
        'message': `Member with ID ${memberID} was deleted.`
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
      const pscopes = req.scopes;
      const { organization, brands, founders, membership } = req.body;
      
      if (!canAccessUser(pscopes)) return;

      if (action === 'create') {
        organization.role = 'owner';
        
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
      const pscope = req.scopes;

      if (!canAccessUser(pscope)) return;

      await OrganizationService.deleteHandler(
        id,
        table,
        res,
        next
      );
    };
  }
}