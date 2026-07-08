import * as z from 'zod';


export const MovementInsertSchema = z.object({
  product_variant_id: z.uuid(),
  quantity_changed:   z.int(),
  movement_type:      z.string(),
  reference_type:     z.string(),
  reference_id:       z.uuid()
});

export const MovementUpdateSchema = z.object({
  product_variant_id: z.uuid().optional(),
  quantity_changed:   z.int().optional(),
  movement_type:      z.string().optional(),
  reference_type:     z.string().optional(),
  reference_id:       z.uuid().optional()
});
