import * as z from 'zod';


export const ItemInsertSchema = z.object({
  product_variant_id: z.uuid(),
  item_code:          z.string(),
  batch_code:         z.string(),
  init_quantity:      z.int(),
  reorder_level:      z.int(),
  unit_cost:          z.number().positive(),
  unit_price:         z.number().positive(),
  expiry_date:        z.iso.date(),
  remarks:            z.string().optional(),
  created_by_name:    z.string()
});

export const ItemUpdateSchema = z.object({
  product_variant_id: z.uuid().optional(),
  item_code:          z.string().optional(),
  batch_code:         z.string().optional(),
  init_quantity:      z.int().optional(),
  current_quantity:   z.int().optional(),
  reorder_level:      z.int().optional(),
  unit_cost:          z.number().positive().optional(),
  unit_price:         z.number().positive().optional(),
  expiry_date:        z.iso.date().optional(),
  remarks:            z.string().optional(),
  status:             z.enum(['in stock', 'low stock', 'out of stock', 'expired']).optional()
});
