import { supabase } from "@/config/db";
import { ConflictError, ErrorII, RecordNotFound } from "@/errors";
import { sanitizeObject } from "@/utils/data.helpers";


export interface Session {
  id?: string;
  user_id?: string;
  refresh_token_hash?: string;
  expires_at?: Date;
  created_at?: Date;
}

export class SessionServices {
  /**
   * 
   * @param session 
   */
  public static async insert( 
    session: Session, 
    ...selectFields: string[] 
  ) {
    const sessionData = sanitizeObject(session);
    const slctStr = selectFields.join(", ");

    const { data, error } = await supabase
      .from('sessions')
      .insert(sessionData)
      .select(slctStr);
    
    if (!error) return data;
    
    throw new ConflictError('Failed to save session info.');
  }

  /**
   * 
   * @param user_id 
   * @param fields 
   * @returns 
   */
  public static async find( 
    sessionID: string, 
    ...fields: string[] 
  ) {
    const selectStr = fields.join(', ');

    const { data, error } = await supabase
      .from('sessions')
      .select(selectStr)
      .eq('id', sessionID)
      .single();
    
    if (error) {
      throw new RecordNotFound(
        `No session info for user was found.`
      );
    }

    return data as unknown as Session;
  }

  /**
   * 
   * @param session_id 
   */
  public static async delete( session_id: string ) {
    const { data, error } = await supabase
      .from('sessions')
      .delete()
      .eq('id', session_id);
    
    if (error) {
      throw new ErrorII('Failed to delete session info.');
    }
  }
}