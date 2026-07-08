import { Request } from "express";
import { ErrorII } from "@/errors";
import { EnumName } from "./base.types";
import { supabase } from "@/config/db";
import { Forbidden } from "@/errors";
import { TableName } from "../organization/organization.types";
import { AuthRequest, BrcRequest, OrgRequest } from "@/config/types";


export const getEnum = async ( name: EnumName ) => {
  const { data, error } = await supabase
    .rpc('get_enum_values', {
      'enum_name': name
    });
  
  if (!error) return data;

  throw new ErrorII(error.message);
}

export const doesRecordExist = async (
  table: TableName,
  options?: {
    eq?: Record<string, string>;
  }
): Promise<boolean> => {
  let query = supabase.from(table).select('id', { count: 'exact', head: true });

  if (options?.eq) {
    for (const [key, value] of Object.entries(options.eq)) {
      query = query.eq(key, value);
    }
  }

  const { error, count } = await query;

  if (error) throw error;

  return (count ?? 0) > 0;
};


export function assertAuth<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>
): asserts req is AuthRequest<Params, ResBody, ReqBody, ReqQuery> {
  if (!(req as Partial<AuthRequest<Params, ResBody, ReqBody, ReqQuery>>).context?.user) {
    throw new Forbidden("Authorized required");
  }
}

export function assertOrg<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>
): asserts req is OrgRequest<Params, ResBody, ReqBody, ReqQuery> {
  if (!(req as Partial<OrgRequest<Params, ResBody, ReqBody, ReqQuery>>).context?.org) {
    throw new Forbidden("Organization required");
  }
}

export function assertBrc<
  Params,
  ResBody,
  ReqBody,
  ReqQuery
>(
  req: Request<Params, ResBody, ReqBody, ReqQuery>
): asserts req is BrcRequest<Params, ResBody, ReqBody, ReqQuery> {
  if (!(req as Partial<BrcRequest<Params, ResBody, ReqBody, ReqQuery>>).context?.brc) {
    throw new Forbidden("Branch required");
  }
}
