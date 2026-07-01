

export interface ProductInsert {
  name: string; 
  brand: string;
  category_id: string;
  remarks?: string;
  specific_branch_only?: boolean;
  branch_id?: string;
  vat_rate: string;
}

export interface ProductUpdate {
  id: string;
  name?: string; 
  brand?: string;
  category_id?: string;
  remarks?: string;
  specific_branch_only?: boolean;
  branch_id?: string;
  vat_rate?: string;
  status?: 'active' | 'discontinued' | 'archived' | 'soft deleted'
}

export interface VariantInsert {
  item_code: string;
  sku: string;
  color?: string;
  size: string;
  unit: string;
  flavor?: string;
  weight?: string;
  volume?: string;
  material?: string;
  barcode?: string;
}

// add updated_at
export interface VariantUpdate {
  id: string;
  item_code?: string;
  sku?: string;
  color?: string;
  size?: string;
  unit?: string;
  flavor?: string;
  weight?: string;
  volume?: string;
  material?: string;
  barcode?: string;
}