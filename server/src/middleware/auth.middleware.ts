import { decodeJwt } from "jose";
import { Forbidden, InvalidCredentials } from "@/errors";
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
import { 
  AuthRequest, 
  BrcRequest, 
  OrgRequest, 
  TypedRequest
} from "@/config/types";
import { 
  assertAuth, 
  assertOrg, 
  assertBrc 
} from "@/modules/base/base.services";



const ERROR_MSG = 'Cannot perform action. User has insufficient permission.';

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

export const requireAuth = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const action = req.get("Token-Action");
    const { acsToken, claims } = loadAccessToken(req);

    if (action !== 'refresh') {
      const payload = await verifyAccessToken({ 
        token_hash: acsToken 
      });
  
      const expiresAt = new Date(payload.exp! * 1000);
  
      if (expiresAt < new Date) {
        throw new InvalidCredentials(
          'Access token is expired.'
        );
      }
    }
    
    if ( typeof claims.sub !== 'string' 
      || typeof claims.sid !== 'string'
    ) { 
      throw new Forbidden(ERROR_MSG);
    }

    (req as AuthRequest).context = {
      user: {
        id: claims.sub,
        sid: claims.sid,
        claims: claims
      }
    };

    next();
  }
  catch (error: unknown) {
    next(error);
  }
}

export const requireOrg = (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    assertAuth(req);

    const claims = req.context.user.claims;

    if ( typeof claims.corg !== 'string'
      || typeof claims.orgrole !== 'string'
      || typeof claims.orgmemid !== 'string'
    ) {
      throw new Forbidden(ERROR_MSG);
    }

    (req as OrgRequest).context.org = {
      id: claims.corg,
      role: claims.orgrole,
      memID: claims.orgmemid
    }

    next();
  }
  catch (error: unknown) {
    next(error);
  }
}

export const requireBrc = (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    const claims = req.context.user.claims;

    if ( typeof claims.brcid !== 'string'
      || typeof claims.brcrole !== 'string'
      || typeof claims.brcmemid !== 'string'
    ) {
      throw new Forbidden(ERROR_MSG);
    }

    (req as BrcRequest).context.brc = {
      id: claims.brcid,
      role: claims.brcrole,
      memID: claims.brcmemid
    }
  }
  catch (error: unknown) {
    next(error);
  }
}

export const verifyOrgPermission = async (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  try{
    assertOrg(req);

    const role = req.context.org.role;

    if ( role !== 'owner' && role !== 'admin') {
      throw new Forbidden(ERROR_MSG);
    }

    next();
  }
  catch (error: unknown) {
    next(error);
  }
}

export const verifyBrcPermission = ( permission: string ) => {
  return async (
    req: TypedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      assertBrc(req);
      
      const role = req.context.brc.role;

      const pInfo = await getPermissionInfo(permission);
      const scopes = await getRoleScope(role, pInfo!);

      if (!scopes || scopes.length <= 0) {
        throw new Forbidden(ERROR_MSG);
      }

      req.context.scopes = scopes;

      next();
    }
    catch (error: unknown) {
      next(error);
    }
  }
}

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
