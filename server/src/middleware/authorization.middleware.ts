import { Forbidden, InvalidCredentials } from "@/errors";
import { isUserInOrg } from "@/modules/organization/membership.services";
import { isUserInBranch } from "@/modules/branch/branch.services";
import { NextFunction, Request, Response } from "express"
import { assertAuth, assertBrc, assertOrg, doesRecordExist } from "@/modules/base/base.services";
import { TableName } from "@/modules/organization/organization.types";


const errMsg = 'You do not have sufficient permissions for this operation.'

// for user module
export const authorizeUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try { 
    // Check if user is logged in and verified.
    assertAuth(req);
    
    const targetID = req.params.id;

    if (typeof targetID !== 'string') {
      throw new InvalidCredentials('Invalid user ID.');
    }
    
    // Is user accessing their own info.
    if (targetID === req.context.user.id) {
      return next();
    }

    // Check if user is an organization member.
    assertOrg(req);

    if (req.context.org.role === 'admin') {
      const inOrg = await isUserInOrg(req.context.org.id, targetID);
      if (inOrg) return next();
    }

    // Check if user has sufficient branch role.
    assertBrc(req);

    const usrScope = req.context.scopes;

    if (usrScope.includes('branch')) {
      const inBrc = await isUserInBranch(req.context.brc.id, targetID);
      if (inBrc) return next();
    }

    throw new Forbidden(errMsg);
  } 
  catch (error: unknown) {
    next(error);
  } 
}

// for branch level modules
export const authorizeBranchAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    assertBrc(req);

    const usrScope     = req.context.scopes;
    const orgId        = req.context.org.id;
    const branchId     = req.context.brc.id;
    const userOrgMemId = req.context.org.memID;
    const targetID     = req.params.id;

    if (typeof targetID !== 'string') { 
      throw new Forbidden(errMsg);
    }

    if (usrScope.includes('self') || usrScope.includes('branch')) {
      if (await hasBranchAccess(userOrgMemId, branchId)) {
        return next();
      }
    }

    if (usrScope.includes('organization')) {
      if (await hasOrganizationAccess(userOrgMemId, orgId)) { 
        return next();
      }
    }

    throw new Forbidden(errMsg);
  }
  catch (error: unknown) {
    next(error);
  }
}


// for organization level modules
export const authorizeOrganizationAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    assertOrg(req);

    const targetID = req.params.id;
    const orgID    = req.context.org.id;
    const memID    = req.context.org.memID;
    const role     = req.context.org.role;

    if (typeof targetID !== 'string') { 
      throw new Forbidden(errMsg);
    }

    if (targetID === memID) {
      return next();
    }

    if (role === 'admin' || role === 'owner') {
      if (await hasOrganizationAccess(memID, orgID)) {
        return next();
      }
    }

    throw new Forbidden(errMsg);
  }
  catch (error: unknown) {
    next(error);
  }
}

const hasBranchAccess = async (
  orgMemID: string, 
  branchID: string
) => {
  const hasAccess = await doesRecordExist(
    TableName.branchMem,
    { 
      eq: { 
        'org_mem_id': orgMemID,
        'branch_id': branchID
      }
    }
  );
  return hasAccess;
}

const hasOrganizationAccess = async (
  orgMemID: string,
  orgID: string
) => {
  const hasAccess = await doesRecordExist(TableName.orgMem,
    { 
      eq: { 
        'id': orgMemID, 
        'org_id': orgID 
      }
    }
  );
  return hasAccess;
}