import { decodeJwt } from "jose";
import { ErrorII, InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express"
import { TokenServices } from "@/modules/token/token.services";
import { AuthServices } from "@/modules/user/auth.services";


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

  const payload = await TokenServices.verifyAccessToken({
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
    || typeof claims.role !== 'string'
  ) {
    throw new InvalidCredentials('Subject ID not found.');
  }

  req.user = {
    id: claims.sub,
    sid: claims.sid,
    role: claims.role,
  };
  next();
}

export const verifyPermission = ( permission: string ) =>
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
  try {
    const role = req.user!.role
    const pInfo = await AuthServices.getPermissionInfo(permission);
    const scopes = AuthServices.getRoleScope(role, pInfo!);

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