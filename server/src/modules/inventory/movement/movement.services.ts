import { ErrorII } from "@/errors";
import { supabase } from "@/config/db";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "@/modules/base/base.repository";
import { MovementInsert, MovementPagination, MovementUpdate } from "./movement.types";
import { handleCursor, handleNextPage } from "@/modules/base/base.services";


export const getAll = async ( 
  branchID: string,
  options: MovementPagination 
) => {
  const orderBy = options.orderBy
    ? options.orderBy
    : 'id';

  let builder = supabase
    .from('inventory_movements')
    .select(`
      id, 
      product_variants(id, sku),
      quantity_changed,
      movement_type,
      reference_type, 
      reference_id,
      created_by,
      updated_at
    `)
    .eq('branch_id', branchID)
    .limit(options.pageSize + 1)
    .order(orderBy, { ascending: options.order === 'asc'});

  if (options.cursor) {
    builder = handleCursor(
      options.cursor,
      builder,
      orderBy,
      options.order
    );
  }

  const { data, error } = await builder;

  if (error) throw new ErrorII(error.message);

  const { hasNextPage, nextCursor } = handleNextPage(
    data,
    options.pageSize,
    orderBy
  );

  return { data, hasNextPage, nextCursor };
}

export const store = async (
  movement: MovementInsert,
  orgMemID: string,
  branchID: string
) => {
  const data = {
    ...sanitizeObject(movement),
    created_by: orgMemID,
    branch_id: branchID
  }

  const db = new BaseRepository('inventory_movements');
  await db.insert(data);
}

export const update = async ( 
  id: string,
  branchID: string,
  movement: MovementUpdate 
) => {
  const idata = {
    ...sanitizeObject(movement),
    'updated_at': new Date()
  }

  const { data, error } = await supabase
    .from('inventory_movements')
    .update(idata)
    .eq('id', id)
    .eq('branch_id', branchID);

  if (!error) return;

  throw new ErrorII(error.message);
}

export const deleteMovement = async ( id: string ) => {
  const db = new BaseRepository('inventory_movements');
  await db.delete(id);
}
