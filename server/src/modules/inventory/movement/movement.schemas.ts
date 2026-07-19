import * as z from 'zod';

import {
  ProductVariantID,
  ReferenceID,
  ReferenceTypeSchema,
} from '../common/inventory.schemas';


const QuantityChanged = z.number().int().meta({
  description: "The quantity of the product variant that has changed",
  example: 10,
});

const MovementType = z.string().meta({
  description: "The type of movement for the product variant",
  example: "INBOUND",
});

export const MovementInsertSchema = z.object({
  product_variant_id: ProductVariantID,
  quantity_changed:   QuantityChanged,
  movement_type:      MovementType,
  reference_type:     ReferenceTypeSchema,
  reference_id:       ReferenceID
});

export const MovementUpdateSchema = z.object({
  product_variant_id: ProductVariantID.optional(),
  quantity_changed:   QuantityChanged.optional(),
  movement_type:      MovementType.optional(),
  reference_type:     ReferenceTypeSchema.optional(),
  reference_id:       ReferenceID.optional()
});
