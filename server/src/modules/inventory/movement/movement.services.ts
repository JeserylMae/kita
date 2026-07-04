import { supabase } from "@/config/db";
import { ErrorII } from "@/errors";
import { MovementInsert, MovementUpdate } from "./movement.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "@/modules/base/base.repository";


export class MovementServices {
  public static async getAll( branchID: string ) {
    const { data, error } = await supabase
      .from('inventory_movements')
      .select(`
        id, 
        product_variants(id, sku),
        quantity_changed,
        movement_type,
        reference_type, 
        reference_id,
        created_by,
        updated_at
      `)
      .eq('branch_id', branchID);

    if (!error) return data;

    throw new ErrorII(error.message);
  }

  public static async store(
    movement: MovementInsert,
    orgMemID: string,
    branchID: string
  ) {
    const data = {
      ...sanitizeObject(movement),
      created_by: orgMemID,
      branch_id: branchID
    }

    const db = new BaseRepository('inventory_movements');
    await db.store(data);
  }

  public static async update( 
    id: string,
    branchID: string,
    movement: MovementUpdate 
  ) {
    const idata = {
      ...sanitizeObject(movement),
      'updated_at': new Date()
    }

    const { data, error } = await supabase
      .from('inventory_movements')
      .update(idata)
      .eq('id', id)
      .eq('branch_id', branchID);

    if (!error) return;

    throw new ErrorII(error.message);
  }

  public static async delete( id: string ) {
    const db = new BaseRepository('inventory_movements');
    await db.delete(id);
  }
}