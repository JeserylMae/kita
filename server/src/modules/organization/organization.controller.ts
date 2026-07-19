import { IdParams } from "../base/base.types";
import { createAccessToken } from "../token/token.services";
import { InvalidCredentials } from "@/errors";
import { accessTokenCookieOptions } from "@/config/types.d";

import * as MembershipServices from "./membership.services";
import * as OrganizationService from "./organization.services";

import { 
  assertAuth, 
  assertOrg 
} from "../base/base.services";

import { 
  NextFunction, 
  Request, 
  Response 
} from "express";

import { 
  MembershipUpdate, 
  OrgInsertRequest, 
  OrgQueryParams, 
  OrgUpdateRequest, 
  TableName 
} from "./organization.types";


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const getOrganizations = async (
  req: Request<any, any, any, OrgQueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const userID = req.context.user.id;
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

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.context.org.id;

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

export const switchOrganization = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const orgID = req.params.id;
    const userID = req.context.user.id;
    const sessionID = req.context.user.sid;

    const org = await MembershipServices.findRole(userID, orgID);

    const acsToken = await createAccessToken(
      { id: userID },
      sessionID,
      orgID,
      org.roles[0]?.role,
      org.id
    );

    res.cookie('ACCESS-TOKEN', acsToken, 
      accessTokenCookieOptions
    ).status(200)
      .json({
        'success': true,
        'message': 'Swithed to selected organization'
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
export const create = async (
  req: Request<any, any, OrgInsertRequest>, 
  res: Response, 
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const { 
      organization, 
      brands, 
      founders, 
      membership 
    } = req.body;
    const userID = req.context.user.id;

    await OrganizationService.store(
      userID!,
      organization,
      brands,
      founders,
      membership
    );

    res.status(201).json({
      'success': true,
      'message': 'Organization created successfully.'
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
export const update = async (
  req: Request<any, any, OrgUpdateRequest>,
  res: Response, 
  next: NextFunction
) => {
  try {
    assertOrg(req);

    const { 
      organization, 
      brands, 
      founders
    } = req.body;
    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.context.org.id;
  
    await OrganizationService.update(
      orgID,
      organization,
      brands,
      founders
    );

    res.status(201).json({
      'success': true,
      'message': 'Organization updated successfully.'
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
export const updateMember = async (
  req: Request<IdParams, any, MembershipUpdate>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.context.org.id;
    const orgMemID = req.params.id;
    const member = req.body;

    await MembershipServices.update(
      orgMemID,
      orgID,
      member
    );

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
 * 
 * @param req 
 * @param res 
 * @param next 
*/
export const deleteOrg = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    const id = req.context.org.id;

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
export const deleteMember = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const memberID = req.params.id;

    await MembershipServices.deleteMembership(memberID);
    
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
 * Returns delete handler
 */
export const deleteFounder = () => 
  createDeleteHandler( TableName.founder );

/**
 * Returns delete handler
 */
export const deleteBrand = () => 
  createDeleteHandler( TableName.brand );

/**
 * 
 * @param table 
 * @returns 
 */
const createDeleteHandler = async (
  table: TableName
) => {
  return async (
    req: Request<IdParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      assertOrg(req);

      const id = req.params.id;
  
      if (typeof id !== 'string') {
        throw new InvalidCredentials(
          'ID is not valid.'
        );
      }
  
      await OrganizationService
        .deleteHandler( id, table, res, next );

      res.status(200).json({
        'success': true,
        'message': 'Record was deleted.'
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }
}
