import * as z from "zod";

import { 
  ReferenceType, 
  ReferenceTypeKeys 
} from '../transaction/transaction.types';



export const Amount = z.number().meta({
  description: "Amount of money",
  example: 100.50,
});

export const PaymentMethod = z.string().meta({
  description: "Payment method",
  example: "cash",
});

export const CategoryID = z.uuid().meta({
  description: "UUID of the product category",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const Remarks = z.string().meta({
  description: "Additional remarks or notes",
  example: "This product is on sale.",
});

export const VatRate = z.number().positive().meta({
  description: "VAT rate as a percentage",
  example: 12.5,
});

export const ItemCode = z.string().meta({
  description: "Unique item code for the product variant",
  example: "ITM-12345",
});

export const SKU = z.string().meta({
  description: "Stock Keeping Unit for the product variant",
  example: "MILK-Standard-1L",
});

export const Color = z.string().optional().meta({
  description: "Color of the product variant",
  example: "Red",
});

export const Size = z.string().meta({
  description: "Size of the product variant",
  example: "Medium",
});

export const Unit = z.string().meta({
  description: "Unit of measurement for the product variant",
  example: "Piece",
});

export const Flavor = z.string().meta({
  description: "Flavor of the product variant",
  example: "Vanilla",
});

export const Weight = z.string().meta({
  description: "Weight of the product variant",
  example: "500g",
});

export const Volume = z.string().meta({
  description: "Volume of the product variant",
  example: "1L",
});

export const Material = z.string().meta({
  description: "Material of the product variant",
  example: "Plastic",
});

export const Barcode = z.string().meta({
  description: "Barcode of the product variant",
  example: "0123456789012",
});

export const ProductVariantID = z.uuid().meta({
  description: "UUID of the product variant",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const InventoryItemID = z.uuid().meta({
  description: "UUID of the inventory item",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const ReferenceTypeSchema = z.enum(
  Object.keys(ReferenceType) as [
    ReferenceTypeKeys,
    ...ReferenceTypeKeys[]
  ]
).meta({
  description: "Type of reference for the transaction",
  example: "sales invoice",
});

export const ReferenceID = z.uuid().meta({
  description: "UUID of the reference entity (e.g., sales invoice, purchase invoice, refund, return)",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const UnitCost = z.number().positive().meta({
  description: "Purchase cost of a single product variant",
  example: 10.50,
});

export const UnitPrice = z.number().positive().meta({
  description: "Selling price of a single product variant",
  example: 15.75,
});