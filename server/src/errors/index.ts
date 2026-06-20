import { ConsoleColor } from "@/utils/template.helper";

export class ErrorII extends Error {
  httpCode: number;

  constructor ( message: string, httpCode?: number ) {
    super( message );
    this.name = new.target.name;
    this.httpCode = httpCode ?? 500;
  }
}

export class ConflictError extends ErrorII {
  constructor( message: string ) {
    super( message, 409);
  }
}

export class AccountNotVerified extends ErrorII {
  constructor( message: string ) {
    super( message, 403 );
    this.name = 'AccountNotVerified';
  }
}

export class InvalidCredentials extends ErrorII {
  constructor( message: string ) {
    super( message, 401 );
    this.name = 'InvalidCredentials';
  }
}

export class RecordNotFound extends ErrorII {
  constructor( message: string ) {
    super( message, 403 )
    this.name = 'RecordNotFound';
  }
}

interface ErrorParam {
  type: Error;
  message: string;
  cause?: string;
}

export const handleError = ( error: Error ) => {
  let log = `${error.name}: ${error.message}`;
  log += ( error.cause ) ? `\nCause: ${error.cause}` : '';
  
  console.error(`${ConsoleColor.ERROR}${log}${ConsoleColor.RESET}`);
  // @TODO: Add logger
}
