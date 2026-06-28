
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sid: string;
        role: string;
      };
      scopes?: string[],
    }
  }
}

export {};