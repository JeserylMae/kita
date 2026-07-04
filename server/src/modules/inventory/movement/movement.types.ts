

export interface MovementInsert {
  product_variant_id: string;
  quantity_changed: number;
  movement_type: string;
  reference_type: string;
  reference_id: string;
}

export interface MovementUpdate {
  product_variant_id?: string;
  quantity_changed?: number;
  movement_type?: string; 
  reference_type?: string;
  reference_id?: string;
}