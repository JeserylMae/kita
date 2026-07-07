import { UserUpdate } from "./user.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";

import * as UserServices from "./user.services";


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
    const userID = req.user?.id;

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
  req: Request<any, any, UserUpdate>, 
  res: Response,
  next: NextFunction 
) => {
  try {
    const userID = req.params.id;
    const user = req.body;
    
    if (!userID) throw new InvalidCredentials(
      'User ID is a required field.'
    );

    const userData = sanitizeObject(user);
    await UserServices.update(userID, userData);

    res.status(201).json({
      'success': true,
      'message': 'Updated user information.',
    });
  }
  catch (error: unknown ) {
    next(error);
  }
}
