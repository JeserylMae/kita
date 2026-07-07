import { ErrorII } from "@/errors";
import { EnumName } from "./base.types";
import { supabase } from "@/config/db";
import { TableName } from "../organization/organization.types";

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