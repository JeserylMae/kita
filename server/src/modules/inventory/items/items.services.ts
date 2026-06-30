import { supabase } from "@/config/db";
import { ErrorII } from "@/errors";


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
}

