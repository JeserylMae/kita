import { User } from "./user.types";
import { supabase } from "@/config/db";
import { sanitizeObject } from "@/utils/data.helpers";
import { ConflictError, RecordNotFound } from "@/errors";

export class UserServices {
  /**
   * 
   * @param role 
   * @returns 
   */
  public static async getRoleID( role: string )
  : Promise<string> {
    const { data, error } = await supabase
      .from('roles')
      .select('id')
      .eq('role', role)
      .single();

    if (!error) return data.id;
    
    throw new ConflictError('Invalid role.');
  }

  /**
   * 
   * @param user 
   * @returns 
   */
  public static async insert( user: User ) {
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
  public static async findByEmail( 
    email: string, 
    ...fields: string[] 
  ) {
    const selectStr = fields.join(', ');

    const { data, error } = await supabase
      .from('users')
      .select(selectStr)
      .eq('email', email)
      .single();

    if ( !error ) return data as unknown as User;

    throw new RecordNotFound(
      `Account with email ${email} does not exist`
    );
  }

  /**
   * 
   * @param id 
   * @param user 
   */
  public static async update( 
    id: string, 
    user: User 
  ) {
    const userData = sanitizeObject(user);

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
  public static async delete( id: string ) {
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (!error) return;
    
    throw new RecordNotFound(
      `User with id ${id} is not found.`
    );
  }
}
