import { decodeJwt } from "jose";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";


export class UserMiddleware {
  public static async attachUser(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const acsToken = req.cookies['ACCESS-TOKEN'];

    if (!acsToken) {
      throw new InvalidCredentials('Access token not found.');
    }
    
    const claims = decodeJwt(acsToken);

    if (!claims || !claims.sub) {
      throw new InvalidCredentials('Subject ID not found.');
    }

    req.user = {
      id: claims.sub
    };
    next();
  }
}