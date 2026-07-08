import { InvalidCredentials } from "@/errors";
import { BrandUpdate, MembershipUpdate, OrgInsert, OrgUpdate, TableName } from "./organization.types";
import { NextFunction, Request, Response } from "express";

import * as MembershipServices from "./membership.services";
import * as OrganizationService from "./organization.services";
import { createAccessToken } from "../token/token.services";
import { accessTokenCookieOptions } from "@/config/types";


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const getOrganizations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.org?.id!;

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const orgID = req.params.id;
    const userID = req.user.id;

    if (typeof orgID !== 'string') {
      throw new InvalidCredentials('Invalid organization ID.');
    }

    const org = await MembershipServices.findRole(userID, orgID);

    const acsToken = await createAccessToken(
      { id: userID },
      req.user.sid,
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
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const { 
      organization, 
      brands, 
      founders, 
      membership 
    } = req.body;
    const userID = req.user?.id;

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
  req: Request,
  res: Response, 
  next: NextFunction
) => {
  try {
    const { 
      organization, 
      brands, 
      founders
    } = req.body;
    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.org?.id!;
  
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
  req: Request<any, any, MembershipUpdate>,
  res: Response,
  next: NextFunction
) => {
  try {
    // Note: the passed id in the params are used for validation
    // whether req.org.id === req.params.id
    const orgID = req.org?.id!;
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
    const id = req.org?.id;

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
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
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
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
