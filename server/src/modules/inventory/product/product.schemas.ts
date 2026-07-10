import * as z from 'zod';


export const ProductInsertSchema = z.object({
  name:                 z.string(),
  brand:                z.string(),
  category_id:          z.uuid(),
  remarks:              z.string().optional(),
  specific_branch_only: z.boolean().optional(),
  branch_id:            z.uuid().optional(),
  vat_rate:             z.number().positive()
});

export const ProductUpdateSchema = z.object({
  name:                 z.string().optional(),
  brand:                z.string().optional(),
  category_id:          z.uuid().optional(),
  remarks:              z.string().optional(),
  specific_branch_only: z.boolean().optional(),
  branch_id:            z.uuid().optional(),
  vat_rate:             z.number().positive().optional(),
  statis:               z.enum(['active', 'discontinued', 'archived', 'soft deleted']).optional()
});

export const VariantInsertSchema = z.object({
  item_code: z.string(),
  sku:       z.string(),
  color:     z.string().optional(),
  size:      z.string(),
  unit:      z.string(),
  flavor:    z.string().optional(),
  weight:    z.string().optional(),
  volume:    z.string().optional(),
  material:  z.string().optional(),
  barcode:   z.string().optional()
});

export const VariantUpdateSchema = z.object({
  item_code: z.string().optional(),
  sku:       z.string().optional(),
  color:     z.string().optional(),
  size:      z.string().optional(),
  unit:      z.string().optional(),
  flavor:    z.string().optional(),
  weight:    z.string().optional(),
  volume:    z.string().optional(),
  material:  z.string().optional(),
  barcode:   z.string().optional()
});