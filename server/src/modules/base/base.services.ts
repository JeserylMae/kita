import { ErrorII } from "@/errors";
import { EnumName } from "./base.types";
import { supabase } from "@/config/db";

export const getEnum = async ( name: EnumName ) => {
  const { data, error } = await supabase
    .rpc('get_enum_values', {
      'enum_name': name
    });
  
  if (!error) return data;

  throw new ErrorII(error.message);
}