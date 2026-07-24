import { UserUpdate } from "./user.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { NextFunction, Request, Response } from "express";

import * as UserServices from "./user.services";
import { AuthRequest } from "@/config/types";
import { IdParams } from "../base/base.types";
import { assertAuth } from "../base/base.services";


/**
 * 
 * @param req 
 * @param res 
 */
export const me = async ( 
  req: Request, 
  res: Response,
  next: NextFunction 
) => {
  try {
    assertAuth(req);

    const userID = req.context.user.id;

    const user = await UserServices.me(userID);

    res.status(200).json({
      'success': true,
      'message': 'User information were retrieved.',
      'user': user,
      'organization': 'org',
    });
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
export const update = async ( 
  req: Request<IdParams, any, UserUpdate>, 
  res: Response,
  next: NextFunction 
) => {
  try {
    assertAuth(req);
    
    const userID = req.params.id;
    const user = req.body;

    await UserServices.update(userID, user);

    res.status(201).json({
      'success': true,
      'message': 'Updated user information.',
    });
  }
  catch (error: unknown ) {
    next(error);
  }
}
