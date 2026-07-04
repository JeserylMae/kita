

export interface ItemInsert {
  product_variant_id: string;
  branch_id: string;
  item_code: string;
  batch_code: string;
  init_quantity: number;
  reorder_level: number;
  unit_cost: number   
  unit_price: number;
  expiry_date: Date;
  remarks?: string;
}

export interface ItemUpdate {
  product_variant_id?: string;
  item_code?: string;
  batch_code?: string;
  init_quantity?: number;
  current_quantity?: number;
  reorder_level?: number;
  unit_cost?: number   
  unit_price?: number;
  expiry_date?: Date;
  status?: 'in stock' | 'low stock' | 'out of stock' | 'expired';
  remarks?: string;
}