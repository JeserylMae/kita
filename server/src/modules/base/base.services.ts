import { ErrorII, InvalidCredentials } from "@/errors";
import { EnumName } from "./base.types";
import { supabase } from "@/config/db";


export const canAccessUser = ( scope: string[] | undefined ) => {
  const errMsg = 'You do not have sufficient permissions for this operation.'

  if (!scope) {
    throw new InvalidCredentials(errMsg);
  }

  if (scope.includes("ORG")) {
    return true;
  }

  if (scope.includes("BRC")) {
    return true;
  }

  if (scope.includes("SELF")) {
    return true;
  }

  throw new InvalidCredentials(errMsg);
}

export const getEnum = async ( name: EnumName ) => {
  const { data, error } = await supabase
    .rpc('get_enum_values', {
      'enum_name': name
    });
  
  if (!error) return data;

  throw new ErrorII(error.message);
}