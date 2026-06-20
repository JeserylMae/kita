import { supabase } from "@/config/db";
import { sanitizeObject } from "@/utils/data.helpers";
import { ConflictError, RecordNotFound, handleError } from "@/errors";


export interface User {
  id?: string;
  auth_id?: string;
  
  firstname?: string;
  middlename?: string;
  lastname?: string;
  suffix?: string;

  house_number?: string;
  street?: string;
  barangay?: string;
  city?: string;
  province?: string;
  region?: string;

  birthdate?: Date;

  role_id?: string;

  email?: string;
  password?: string;

  updated_at?: Date;
  verified_at?: Date;
}

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

    if (error) {
      handleError(error);
      throw new ConflictError('Invalid role.');
    }
    return data.id;
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
      
    if (error) {
      throw new ConflictError(error.code === '23505' ?
        'Email already exists.' :
        error.message
      );
    }
    return true;
  }

  /**
   * 
   * @param email 
   * @param fields 
   * @returns 
   */
  public static async findByEmail( email: string, ...fields: string[] ) {
    const selectStr = fields.join(', ');

    const { data, error } = await supabase
      .from('users')
      .select(selectStr)
      .eq('email', email)
      .single();

    if ( error ) {
      throw new RecordNotFound(`Account with email ${email} does not exist`);
    }
    return data as unknown as User;
  }

  /**
   * 
   * @param id 
   * @param user 
   */
  public static async update( id: string, user: User ) {
    const userData = sanitizeObject(user);

    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id);
    
    if (error) {
      throw new ConflictError(error.code === '23505' ?
        'Email already exists.' :
        error.message
      );
    }
  }
}
