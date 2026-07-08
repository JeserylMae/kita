import * as z from 'zod';
import { 
  ProductInsertRequestSchema,
  ProductInsertSchema, 
  ProductUpdateSchema, 
  VariantInsertSchema, 
  VariantUpdateSchema 
} from './product.schemas';


export type ProductInsert        = z.infer<typeof ProductInsertSchema>;

export type ProductUpdate        = z.infer<typeof ProductUpdateSchema>;

export type VariantInsert        = z.infer<typeof VariantInsertSchema>;

export type VariantUpdate        = z.infer<typeof VariantUpdateSchema>;

export type ProductInsertRequest = z.infer<typeof ProductInsertRequestSchema>;