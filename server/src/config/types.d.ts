
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sid: string;
      };
      org?: {
        id: string | null;
        role: string | null;
        orgmemID: string | null;
      } 
      branch?: {
        id: string | null;
        role: string | null;
      }
      scopes?: string[],
    }
  }
}

export {};