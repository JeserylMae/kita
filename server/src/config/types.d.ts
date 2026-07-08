import { Request } from "express";
import { JWTPayload } from "jose";


export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
};

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

export type TypedRequest<
  Params = {},
  ResBody = any,
  ReqBody = any,
  ReqQuery = {}
> = Request<Params, ResBody, ReqBody, ReqQuery>;

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