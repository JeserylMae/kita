import { supabase } from "@/config/db";
import { sanitizeObject } from "@/utils/data.helpers";
import { ConflictError, RecordNotFound } from "@/errors";
import { UserSelect, UserInsert, UserUpdate } from "./user.types";


/**
 * 
 * @param user 
 * @returns 
 */
export const insert = async ( 
  user: UserInsert 
) => {
  const userData = sanitizeObject(user);

  const { data, error } = await supabase
    .from('users')
    .insert(userData);
    
  if (!error) return true;
  
  throw new ConflictError(
    error.code === '23505' ?
      'Email already exists.' :
      error.message
  );
}

/**
 * 
 * @param email 
 * @param fields 
 * @returns 
 */
export const findByEmail = async <K extends keyof UserSelect>( 
  email: string, 
  ...fields: (K | '*')[]
) => {
  const selectStr = fields.includes('*') 
    ? '*'
    : fields.join(', ');

  const { data, error } = await supabase
    .from('users')
    .select(selectStr)
    .eq('email', email)
    .single();

  if ( !error ) return data as unknown as Pick<UserSelect, K>;

  throw new RecordNotFound(
    `Account with email ${email} does not exist`
  );
}

/**
 * 
 * @param id 
 * @param user 
 */
export const update = async ( 
  id: string, 
  user: UserUpdate
) => {
  const userData = {
    ...sanitizeObject(user),
    updated_at: new Date()
  };

  const { data, error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id);
  
  if (!error) return; 

  throw new ConflictError(
    error.code === '23505' ?
      'Email already exists.' :
      error.message
  );
}

/**
 * 
 * @param id 
 */
export const deleteUser = async ( id: string ) => {
  const { data, error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (!error) return;
  
  throw new RecordNotFound(
    `User with id ${id} is not found.`
  );
}

