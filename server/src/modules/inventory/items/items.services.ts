import { ErrorII } from "@/errors";
import { supabase } from "@/config/db";
import { BaseRepository } from "@/modules/base/base.repository";
import { sanitizeObject } from "@/utils/data.helpers";
import { ItemInsert, ItemUpdate } from "./items.types";


export const getAllItems = async (
  branchID: string,
  orgID: string
) => {
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

export const store = async ( 
  item: ItemInsert,
  createdBy: string 
) => {
  const idata = { 
    ...item, 
    current_quantity: item.init_quantity, 
    status: 'in stock',
    created_by: createdBy
  }
  
  const { data, error } = await supabase
    .from('inventory_items')
    .insert(idata);

  if (!error) return;

  throw new ErrorII(error.message);
}

export const update = async ( 
  itemID: string,
  branchID: string,
  item: ItemUpdate 
) => {
  const obj = sanitizeObject(item);
  const idata = { 
    ...obj,
    updated_at: new Date()
  }
  
  const { data, error } = await supabase
    .from('inventory_items')
    .update(idata)
    .eq('id', itemID)
    .eq('branch_id', branchID);
  
  if (!error) return;

  throw new ErrorII(error.message);
}

export const deleteItem = async ( id: string ) => {
  const db = new BaseRepository('inventory_items');
  await db.delete(id);
}
