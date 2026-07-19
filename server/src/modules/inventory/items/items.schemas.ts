import * as z from 'zod';

import {
  ProductVariantID,
  ItemCode,
  UnitCost,
  UnitPrice,
  Remarks,
} from '@/modules/inventory/common/inventory.schemas';


import {
  ExpiresAt,
  CreatedByName,
} from '@/modules/base/base.schemas'

const BatchCode = z.string().meta({
  description: "Batch code for the product variant",
  example: "BATCH-001",
});

const Quantity = z.number().int().positive().meta({
  description: "Quantity of the product variant",
  example: 100,
});

const ReorderLevel = z.number().int().positive().meta({
  description: "Reorder level for the product variant",
  example: 10,
});

const Status = z.enum(['in stock', 'low stock', 'out of stock', 'expired']).meta({
  description: "Status of the product variant",
  example: "in stock",
});

export const ItemInsertSchema = z.object({
  product_variant_id: ProductVariantID,
  item_code:          ItemCode,
  batch_code:         BatchCode,
  init_quantity:      Quantity,
  reorder_level:      ReorderLevel,
  unit_cost:          UnitCost,
  unit_price:         UnitPrice,
  expiry_date:        ExpiresAt,
  remarks:            Remarks.optional(),
  created_by_name:    CreatedByName,
});

export const ItemUpdateSchema = z.object({
  product_variant_id: ProductVariantID.optional(),
  item_code:          ItemCode.optional(),
  batch_code:         BatchCode.optional(),
  init_quantity:      Quantity.optional(),
  current_quantity:   Quantity.optional(),
  reorder_level:      ReorderLevel.optional(),
  unit_cost:          UnitCost.optional(),
  unit_price:         UnitPrice.optional(),
  expiry_date:        ExpiresAt.optional(),
  remarks:            Remarks.optional(),
  status:             Status.optional()
});
