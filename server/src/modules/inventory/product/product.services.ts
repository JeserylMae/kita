import { ErrorII } from "@/errors";
import { supabase } from "@/config/db";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "@/modules/base/base.repository";
import { ProductInsert, VariantInsert } from "./product.types";


export class ProductServices {
  public static async getAll( orgID: string ) {
    const { data, error } = await supabase
      .from('organization_products')
      .select(`
        id, 
        name,
        brand,
        categories(
          id,
          name, 
          hex_color, 
          icon
        ),
        vat_rate, 
        product_variants(
          id, 
          item_code, 
          sku, 
          color, 
          size, 
          unit, 
          flavor, 
          weight, 
          volume, 
          material
        )
      `)
      .eq('organization_id', orgID);
    
    if(!error) return data;

    throw new ErrorII(error.message);
  }

  public static async store( 
    product: ProductInsert,
    orgID: string,
    orgMemID: string,
    variant?: VariantInsert[]
  ) {
    const pdata = { 
      ...sanitizeObject(product),
      'organization_id': orgID,
      'status': 'active',
      'created_by': orgMemID
    }

    const db = new BaseRepository('organization_products');
    const new_product = await db.store(pdata);

    if (!variant) return;

    const vdata = {
      ...sanitizeObject(variant),
      org_product_id: new_product.id,
      created_by: orgMemID,
      org_id: orgID
    }
    
    const variantDB = new BaseRepository('product_variants');
    await variantDB.store(vdata);
  }

  public static async update<T extends Record<string, any>>(
    id: string,
    orgID: string,
    params: T,
    table: 'organization_products' | 'product_variants'
  ) {
    const pdata = {
      ...sanitizeObject(params),
      'updated_at': new Date()
    }

    const col = table === 'organization_products'
      ? 'organization_id' : 'org_id';

    const { data, error } = await supabase
      .from(table)
      .update(pdata)
      .eq('id', id)
      .eq(col, orgID);

    if (!error) return;

    throw new ErrorII(error.message);
  }

  public static async delete( id: string, table: string ) {
    const db = new BaseRepository(table);

    await db.delete(id);
  }

  private static async save(
    record: Record<string, any>,
    table: string
  ) {
    const { data, error } = await supabase
      .from(table)
      .insert(record);

    if (!error) return;

    throw new ErrorII(error.message);
  }
}