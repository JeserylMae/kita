import * as z from 'zod';
import { 
  QueryParamsSchema,
  TransactionInsertSchema, 
  TransactionUpdateSchema 
} from './transaction.schemas';


export type ReferenceTypeKeys = keyof typeof ReferenceType;

export type QueryParams       = z.infer<typeof QueryParamsSchema>;

export type TransactionInsert = z.infer<typeof TransactionInsertSchema>;

export type TransactionUpdate = z.infer<typeof TransactionUpdateSchema>;

export const ReferenceType = {
  'sales invoice': {
    table: 'sales_invoice_items',
    id: 'sales_invoice_id',
    select: (`
      id,
      product_variants(id, sku),
      quantity,
      unit_price,
      unit_cost,
      line_total
    `)
  }, 
  'purchase invoice': {
    table: 'purchase_invoice_items',
    id: 'purchase_invoice_id',
    select: (`
      id,
      product_variants(id, sku),
      quantity,
      unit_price,
      unit_cost,
      line_total
    `)
  }, 
  'refund': {
    table: 'refund_items',
    id: 'refund_id',
    select: (`
      id,
      sales_invoice_items(
        id, 
        product_variants(id, sku),
        unit_price,
        unit_cost,
      ),
      quantity, 
      amount
    `)
  },
  'return': {
    table: 'refund_items',
    id: 'refund_id',
    select: (`
      id,
      sales_invoice_items(
        id, 
        product_variants(id, sku),
        unit_price,
        unit_cost,
      ),
      quantity, 
      amount
    `)
  },
  'stock adjustment': {
    table: 'inventory_movements',
    id: 'id',
    select: (`
      id, 
      product_variants(id, sku),
      quantity_changed,
      movement_type,
      inventory_items(
        batch_code,
        unit_price,
        unit_cost
      )
    `)
  }, 
  'stock transfer':{
    table: 'inventory_movements',
    id: 'id',
    select: (`
      id, 
      product_variants(id, sku),
      quantity_changed,
      movement_type,
      inventory_items(
        batch_code,
        unit_price,
        unit_cost
      )
    `)
  },  
  'supplier payment':{
    table: 'expenses',
    id: 'id',
    select: (`
      id, 
      categories(*), 
      type, 
      amount, 
      payment_method
    `)
  },
}