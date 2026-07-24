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
  branch_id:            BranchID.optional().nullable(),
  vat_rate:             invt.VatRate,
});

export const ProductUpdateSchema = z.object({
  name:                 ProductName.optional().nullable(),
  brand:                ProductBrand.optional().nullable(),
  category_id:          invt.CategoryID.optional().nullable(),
  remarks:              invt.Remarks.optional().nullable(),
  specific_branch_only: SpecificBranchOnly.optional().nullable(),
  branch_id:            BranchID.optional().nullable(),
  vat_rate:             invt.VatRate.optional().nullable(),
  status:               ProductStatus.optional().nullable()
});

export const VariantInsertSchema = z.object({
  item_code: invt.ItemCode,
  sku:       invt.SKU,
  color:     invt.Color.optional().nullable(),
  size:      invt.Size,
  unit:      invt.Unit,
  flavor:    invt.Flavor.optional().nullable(),
  weight:    invt.Weight.optional().nullable(),
  volume:    invt.Volume.optional().nullable(),
  material:  invt.Material.optional().nullable(),
  barcode:   invt.Barcode.optional().nullable()
});

export const VariantUpdateSchema = z.object({
  item_code: invt.ItemCode.optional().nullable(),
  sku:       invt.SKU.optional().nullable(),
  color:     invt.Color.optional().nullable(),
  size:      invt.Size.optional().nullable(),
  unit:      invt.Unit.optional().nullable(),
  flavor:    invt.Flavor.optional().nullable(),
  weight:    invt.Weight.optional().nullable(),
  volume:    invt.Volume.optional().nullable(),
  material:  invt.Material.optional().nullable(),
  barcode:   invt.Barcode.optional().nullable()
});

export const ProductInsertRequestSchema = z.object({
  product:  ProductInsertSchema,
  variants: VariantInsertSchema.array()
});
