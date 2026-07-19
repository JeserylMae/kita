import * as z from 'zod';
import { BranchID } from '@/modules/base/base.schemas';

import * as invt from '../common/inventory.schemas';

const ProductName = z.string().meta({
  description: "Name of the product",
  example: "Apple iPhone 13",
});

const ProductBrand = z.string().meta({
  description: "Brand of the product",
  example: "Apple",
});

const SpecificBranchOnly = z.boolean().meta({
  description: "Indicates if the product is available only in a specific branch",
  example: true,
});

const ProductStatus = z.enum(['active', 'discontinued', 'archived', 'soft deleted']).meta({
  description: "Status of the product",
  example: "active",
});

export const ProductInsertSchema = z.object({
  name:                 ProductName,
  brand:                ProductBrand,
  category_id:          invt.CategoryID,
  remarks:              invt.Remarks,
  specific_branch_only: SpecificBranchOnly,
  branch_id:            BranchID.optional(),
  vat_rate:             invt.VatRate,
});

export const ProductUpdateSchema = z.object({
  name:                 ProductName.optional(),
  brand:                ProductBrand.optional(),
  category_id:          invt.CategoryID.optional(),
  remarks:              invt.Remarks.optional(),
  specific_branch_only: SpecificBranchOnly.optional(),
  branch_id:            BranchID.optional(),
  vat_rate:             invt.VatRate.optional(),
  status:               ProductStatus.optional()
});

export const VariantInsertSchema = z.object({
  item_code: invt.ItemCode,
  sku:       invt.SKU,
  color:     invt.Color.optional(),
  size:      invt.Size,
  unit:      invt.Unit,
  flavor:    invt.Flavor.optional(),
  weight:    invt.Weight.optional(),
  volume:    invt.Volume.optional(),
  material:  invt.Material.optional(),
  barcode:   invt.Barcode.optional()
});

export const VariantUpdateSchema = z.object({
  item_code: invt.ItemCode.optional(),
  sku:       invt.SKU.optional(),
  color:     invt.Color.optional(),
  size:      invt.Size.optional(),
  unit:      invt.Unit.optional(),
  flavor:    invt.Flavor.optional(),
  weight:    invt.Weight.optional(),
  volume:    invt.Volume.optional(),
  material:  invt.Material.optional(),
  barcode:   invt.Barcode.optional()
});
  
  export const ProductInsertRequestSchema = z.object({
    product:  ProductInsertSchema,
    variants: VariantInsertSchema.array()
  });