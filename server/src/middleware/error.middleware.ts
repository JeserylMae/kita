import { ErrorII } from "@/errors";
import { ConsoleColor } from "@/utils/template.helper";
import { NextFunction, Request, Response } from "express";


export class ErrorMiddleware {
  public static async handleError(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    let code = 500;
    let message = 'Internal server error.';
  
    if ( error instanceof ErrorII ) {
      code = error.httpCode;
      message = error.message;
    }
  
    ErrorMiddleware.logError(error);
    res.status(code).json({
      'success': false, 
      'message': message,
    });
  }

  
  private static logError( error: unknown ) {
    if ( error instanceof ErrorII ) {    
      let log = `${error.name}: ${error.message}`;
      log += ( error.cause ) ? `\nCause: ${error.cause}` : '';
        
      // @TODO: Add logger
        console.error(`${ConsoleColor.ERROR}${log}${ConsoleColor.RESET}`);
    }
    console.error(`${ConsoleColor.ERROR}
      Error: Internal server error.\n
      ${error}\n\n
      ${ConsoleColor.RESET}
    `); 
  }
}