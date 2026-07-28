import { supabase } from "@/config/db"
import { ErrorII } from "@/errors";

import { 
  ReferenceTypeKeys, 
  ReferenceType, 
  TransactionInsert,
  TransactionUpdate,
  TransactionPagination
} from "./transaction.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "@/modules/base/base.repository";
import { handleCursor, handleNextPage } from "@/modules/base/base.services";


export const findAll = async ( 
  branhID: string,
  options: TransactionPagination
) => {
  const orderBy = options.orderBy
    ? options.orderBy
    : 'id';

  let builder = supabase
    .from('transactions')
    .select('*')
    .eq('branch_id', branhID)
    .limit(options.pageSize + 1)
    .order(orderBy, { ascending: options.order === 'asc' });

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

   return handleNextPage(
    data,
    options.pageSize,
    orderBy
  );
}

export const findDetails = async <K extends ReferenceTypeKeys>(
  id: string,
  referenceType: K
) => {
  const reference = ReferenceType[referenceType];

  const { data, error } = await supabase
    .from(reference.table)
    .select(reference.select)
    .eq(reference.id, id)
    .single();
  
  if (!error) return data;

  throw new ErrorII(error.message);
}

export const store = async ( txn: TransactionInsert) => {
  const tdata = sanitizeObject(txn);
  const db = new BaseRepository('transactions');

  await db.insert(tdata);
}

export const update = async ( 
  id: string,
  branchID: string,
  txn: TransactionUpdate 
) => {
  const tdata = {
    ...sanitizeObject(txn),
    updated_at: new Date()
  };

  const { data, error } = await supabase
    .from('transactions')
    .update(tdata)
    .eq('id', id)
    .eq('branch_id', branchID);

  if (!error) return;

  throw new ErrorII(error.message);
}

export const deleteTxn = async ( id: string ) => {
  const db = new BaseRepository('transactions');
  await db.delete(id);
}