

export interface MovementInsert {
  product_variant_id: string;
  quantity_changed: number;
  movement_type: ;
  reference_type: ;
  reference_id: string;
}

export interface MovementUpdate {
  id: string;
  product_variant_id?: string;
  quantity_changed?: number;
  movement_type?: ;
  reference_type?: ;
  reference_id?: string;
}