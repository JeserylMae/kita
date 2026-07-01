import { supabase } from "@/config/db";
import { ErrorII } from "@/errors";
import { ProductInsert, VariantInsert } from "./product.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "@/modules/base/base.repository";


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
    const new_product = await db.upsert(pdata);

    if (!variant) return;

    const vdata = {
      ...sanitizeObject(variant),
      org_product_id: new_product[0].id,
      created_by: orgMemID,
      org_id: orgID
    }
    const { data, error } = await supabase
      .from('product_variants')
      .upsert(vdata, {
        onConflict: 'item_code,sku',
        ignoreDuplicates: true
      });
    
    if (!error) return;

    throw new ErrorII(error.message);
  }

  public static async update<T extends Record<string, any>>(
    params: T,
    table: 'organization_products' | 'product_variants'
  ) {
    const data = {
      ...sanitizeObject(params),
      'updated_at': new Date()
    }

    const db = new BaseRepository(table);
    await db.upsert(data);
  }

  public static async delete( id: string, table: string ) {
    const db = new BaseRepository(table);

    await db.delete(id);
  }
}