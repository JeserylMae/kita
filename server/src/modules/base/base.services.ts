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

export function assertAuth(req: Request): asserts req is AuthRequest {
  if (!(req as Partial<AuthRequest>).context?.user) {
    throw new Forbidden("Authentication required");
  }
}

export function assertOrg(req: Request): asserts req is OrgRequest {
  if (!(req as Partial<OrgRequest>).context?.org) {
    throw new Forbidden("Organization required");
  }
}

export function assertBrc(req: Request): asserts req is BrcRequest {
  if (!(req as Partial<BrcRequest>).context?.brc) {
    throw new Forbidden("Branch required");
  }
}