import { Request } from "express";
import { JWTPayload } from "jose";

// declare global {
//   namespace Express {
//     interface Request {
//       user?: {
//         id: string;
//         sid: string;
//       };
//       org?: {
//         id: string | null;
//         role: string | null;
//         orgmemID: string | null;
//       } 
//       branch?: {
//         id: string | null;
//         role: string | null;
//       }
//       scopes?: string[],
//     }
//   }
// }

// export {};

interface User {
  id: string;
  sid: string;
  claims: JWTPayload
}

interface Organization {
  id: string;
  role: string;
  memID: string;
}

interface Branch {
  id: string;
  role: string;
  memID: string;
}

interface AuthContext {
  user: User;
}

interface OrganizationContext {
  user: User;
  org: Organization;
}

interface BranchContext {
  user: User;
  org: Organization;
  brc: Branch;
  scopes: string[];
}


export type AuthRequest<
  Params = any,
  ResBody = any, 
  ReqBody = any,
  ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery> & {
  context: AuthContext
}

export type OrgRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery>  & {
  context: OrganizationContext
}

export type BrcRequest<
  Params = any,
  ResBody = any,
  ReqBody = any,
  ReqQuery = any
> = Request<Params, ResBody, ReqBody, ReqQuery>  & {
  context: BranchContext
}