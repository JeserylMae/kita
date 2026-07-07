import { Forbidden } from "@/errors";
import { isUserInOrg } from "@/modules/organization/membership.services";
import { isUserInBranch } from "@/modules/branch/branch.services";
import { NextFunction, Request, Response } from "express"
import { doesRecordExist } from "@/modules/base/base.services";
import { TableName } from "@/modules/organization/organization.types";


const errMsg = 'You do not have sufficient permissions for this operation.'

export const authorizeUserAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try { 
    const usrScope = req.scopes;
    const targetID = req.params.id;

    if (!usrScope || typeof targetID !== 'string') { 
      throw new Forbidden(errMsg);
    }
    
    if (usrScope.includes('self') && targetID === req.user?.id) {
      return next();
    }

    if (usrScope.includes('branch')) {
      const inBrc = await isUserInBranch(req.branch?.id!, targetID);
      if (inBrc) return next();
    }

    if (usrScope.includes('organization')) {
      const inOrg = await isUserInOrg(req.org?.id!, targetID);
      if (inOrg) return next();
    }

    throw new Forbidden(errMsg);
  } 
  catch (error: unknown) {
    next(error);
  } 
}

// for branch and branch members 
export const authorizeBranchAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usrScope = req.scopes ?? [];
    const orgId = req.org?.id;
    const branchId = req.branch?.id;
    const userOrgMemId = req.org?.orgmemID;
    const targetID = req.params.id;

    if (!usrScope || typeof targetID !== 'string'
      || !branchId || !userOrgMemId || !orgId
    ) { 
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


// for organization and organization members 
export const authorizeOrganizationAccess = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const usrScope = req.scopes;
    const targetID = req.params.id;
    const orgID = req.org?.id;
    const branchID = req.branch?.id;
    const userOrgMemID = req.org?.orgmemID;

    if (!usrScope || typeof targetID !== 'string'
      || !branchID || !userOrgMemID || !orgID
    ) { 
      throw new Forbidden(errMsg);
    }

    if (usrScope.includes('self') || usrScope.includes('branch')) {
      if (await hasBranchAccess(userOrgMemID, branchID)) {
        return next();
      }
    }

    if (usrScope.includes('organization')) {
      if (await hasOrganizationAccess(userOrgMemID, orgID)) {
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