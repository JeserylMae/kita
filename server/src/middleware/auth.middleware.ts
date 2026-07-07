import { decodeJwt } from "jose";
import { InvalidCredentials } from "@/errors";
import { verifyAccessToken } from "@/modules/token/token.services";

import { 
  NextFunction, 
  Request, 
  Response 
} from "express"
import { 
  getRoleScope, 
  getPermissionInfo 
} from "@/modules/user/auth.services";


const loadAccessToken = (
  req: Request
) => {
  const acsToken = req.cookies['ACCESS-TOKEN'];

  if (!acsToken) {
    throw new InvalidCredentials('Access token not found.');
  }
  
  const claims = decodeJwt(acsToken);

  return { acsToken, claims };
}

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { acsToken, claims } = loadAccessToken(req);

  const payload = await verifyAccessToken({
    token_hash: acsToken
  });

  const expiresAt = new Date(payload.exp! * 1000);

  if (expiresAt < new Date) {
    throw new InvalidCredentials(
      'Access token is expired.'
    );
  }

  if ( typeof claims.sub !== 'string' 
    || typeof claims.sid !== 'string' 
    || typeof claims.corg !== null
    || typeof claims.orgrole !== null
    || typeof claims.orgmemid !== null
    || typeof claims.branchid !== null
    || typeof claims.branchrole !== null
    || typeof claims.corg !== 'string'
    || typeof claims.orgrole !== 'string'
    || typeof claims.orgmemid !== 'string'
    || typeof claims.branchid !== 'string'
    || typeof claims.branchrole !== 'string'
  ) {
    throw new InvalidCredentials('Subject ID not found.');
  }

  req.user = {
    id: claims.sub,
    sid: claims.sid,
  };
  req.org = {
    id: claims.corg,
    role: claims.orgrole,
    orgmemID: claims.orgmemid
  }
  req.branch = {
    id: claims.branchid,
    role: claims.branchrole
  }
  next();
}

export const verifyPermission = ( permission: string ) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
    // If user is not yet member of any branch 
    // and user's organization role is owner
    // role is super_admin
    const role = req.branch?.role 
      ? req.branch.role
      : req.org?.role === 'owner' ? 'super_admin' : null;
    
    if (!role) {
      throw new InvalidCredentials(
        'Cannot perform action. User has insufficient permission.'
      );
    }

    const pInfo = await getPermissionInfo(permission);
    const scopes = await getRoleScope(role, pInfo!);

    if (!scopes || scopes.length <= 0) {
      throw new InvalidCredentials('Unauthorized user.');
    }

    req.scopes = scopes;

    next();
  }
  catch (error: unknown) {
    next(error);
  }
};

export const requireGuest = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
    const { acsToken, claims} = loadAccessToken(req);

    if (typeof claims.sid === 'string') {
      return res.status(409).json({
        success: false,
        code: 'SESSION_EXISTS',
        message: 'A user is already logged in.'
      });
    }
    next();
  }
  catch (error: unknown) {
    next();
  }
}