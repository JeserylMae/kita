import { Forbidden } from "@/errors";
import { isUserInOrg } from "@/modules/organization/membership.services";
import { isUserInBranch } from "@/modules/branch/branch.services";
import { NextFunction, Request, Response } from "express"


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
    
    if (targetID === req.user?.id && usrScope.includes('self')) {
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
