import { supabase } from "@/config/db";
import { ErrorII } from "@/errors";
import { ItemInsert, ItemUpdate } from "./items.types";
import { BaseRepository } from "@/modules/base/base.repository";
import { sanitizeObject } from "@/utils/data.helpers";


export class ItemsServices {
  public static async getAllItems(
    branchID: string,
    orgID: string
  ) {
    const { data, error } = await supabase
      .from('product_variants')
      .select(`
        id,
        sku,
        organization_products:org_product_id(
          id,
          name,
          brand,
          categories:category_id(id, name, hex_color, icon)
        ),
        inventory_items(
          id,
          item_code,
          batch_code,
          init_quantity,
          current_quantity,
          unit_cost,
          unit_price,
          expiry_date,
          status
        )
      `)
      .eq('inventory_items.branch_id', branchID)
      .eq('organization_products.organization_id', orgID);

    if (!error) return data;

    throw new ErrorII(error.message);
  }

  public static async store( 
    item: ItemInsert,
    createdBy?: string 
  ) {
    const idata = { 
      ...item, 
      current_quantity: item.init_quantity, 
      status: 'in stock'
    }

    if (createdBy) {
      idata.created_by = createdBy;
    }
    
    const db = new BaseRepository('inventory_items');
    await db.upsert(idata);
  }

  public static async update( item: ItemUpdate ) {
    const obj = sanitizeObject(item);
    const idata = { 
      ...obj,
      updated_at: new Date()
    }
    
    const { data, error } = await supabase
      .from('inventory_items')
      .upsert(idata, {
        onConflict: 'id,branch_id',
        ignoreDuplicates: true
      });
    
    if (!error) return;

    throw new ErrorII(error.message);
  }

  public static async delete( id: string ) {
    const db = new BaseRepository('inventory_items');
    await db.delete(id);
  }
}

