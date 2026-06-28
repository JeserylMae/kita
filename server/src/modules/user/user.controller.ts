import { User } from "./user.types";
import { UserServices } from "./user.services";
import { sanitizeObject } from "@/utils/data.helpers";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";

export class UserController {
  /**
   * 
   * @param req 
   * @param res 
   */
  public static async me( 
    req: Request, 
    res: Response,
    next: NextFunction 
  ) {
    try {
      const { email } = req.body;
  
      const user = await UserServices.findByEmail(email, '*');
  
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
  public static async update ( 
    req: Request<{}, {}, User>, 
    res: Response,
    next: NextFunction 
  ) {
    try {
      const user = req.body;
      
      // @TODO: Move this to middleware.
      if (!user.id) throw new InvalidCredentials(
        'User ID is a required field.'
      );
      const id = user.id;
      delete user.id;

      const userData = sanitizeObject(user);
      await UserServices.update(id, userData);

      res.status(201).json({
        'success': true,
        'message': 'Updated user information.',
      });
    }
    catch (error: unknown ) {
      next(error);
    }
  }
}