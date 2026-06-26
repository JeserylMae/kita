import { supabase } from "@/config/db";
import { ErrorII } from "@/errors";


export class BaseRepository {
  table: string;

  constructor( table: string ) {
    this.table = table;
  }

  /**
   * 
   * @param orgID 
   * @param fields 
   * @returns 
   */
  public async findByOrg( 
    orgID: string,
    ...fields: string[]
  ) {
    const slctStr = fields.join(', ');

    let query = supabase
      .from(this.table)
      .select(slctStr);

    const { data, error } = await query;

    if (!error) return data;

    throw new ErrorII(error.message);
  }

  /**
   * 
   * @param record 
   * @returns 
   */
  public async upsert<T extends Record<string, any>>( 
      record: T | T[]
  ) {
    const { data, error } = await supabase
      .from(this.table)
      .upsert(record as any)
      .select();

    if (!error) return data;

    throw new ErrorII(error.message);
  }

  /**
   * 
   * @param id 
   * @returns 
   */
  public async delete( 
    id: string, 
    column: string = 'id'
  ) {
    const { data, error } = await supabase
      .from(this.table)
      .delete()
      .eq(column, id);

    if (!error) return;

    throw new ErrorII('Failed to delete founder.');
  }
}