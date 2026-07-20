
export class ErrorII extends Error {
  httpCode: number;

  constructor ( message: string, httpCode?: number ) {
    super( message );
    this.name = new.target.name;
    this.httpCode = httpCode ?? 500;
    Object.setPrototypeOf(this, new.target.prototype);
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

export class Forbidden extends ErrorII {
  constructor( message: string ) {
    super( message, 403 );
    this.name = 'Forbidden';
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
    super( message, 404 )
    this.name = 'RecordNotFound';
  }
}

export class BadRequest extends ErrorII {
  constructor( message: string ) {
    super( message, 400 )
    this.name = 'BadRequest';
  }
}

interface ErrorParam {
  type: Error;
  message: string;
  cause?: string;
}

