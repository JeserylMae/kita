import config from "@/config";
import { decodeJwt } from "jose";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";

export class UserMiddleware {
  public static attachUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const claims = UserMiddleware.loadAccessToken(req);

    if ( typeof claims.sub !== 'string' 
      || typeof claims.sid !== 'string' 
    ) {
      throw new InvalidCredentials('Subject ID not found.');
    }

    req.user = {
      id: claims.sub,
      sid: claims.sid,
    };
    next();
  }

  public static requireGuest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const claims = UserMiddleware.loadAccessToken(req);

      if (typeof claims.sid === 'string') {
        return res.status(409).json({
          success: false,
          code: 'SESSION_EXISTS',
          message: 'A user is already logged in.'
        });
      }
      next();
    }
    catch {
      next();
    }
  }

  private static loadAccessToken(
    req: Request
  ) {
    const acsToken = req.cookies['ACCESS-TOKEN'];

    if (!acsToken) {
      throw new InvalidCredentials('Access token not found.');
    }
    
    const claims = decodeJwt(acsToken);

    return claims;
  }
}