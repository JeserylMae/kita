import { supabase } from "@/config/db";
import { TableName } from "../organization/organization.types";
import { decodeCursor, sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "../base/base.repository";

import { 
  BranchInsert, 
  BranchPagination, 
  MemberInsert
} from "./branch.types";
import { 
  ErrorII, 
  InvalidCredentials 
} from "@/errors";
import { handleCursor, handleNextPage } from "../base/base.services";



export const isUserInBranch = async (
  branchId: string,
  userId: string
) => {
  const { data, error } = await supabase
    .from('branch_members')
    .select('id, organization_members!inner(user_id)')
    .eq('branch_id', branchId)
    .eq('organization_members.user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  return !!data;
};

export const findRole = async ( 
  orgMemID: string,
  branchID: string, 
) => {
  const { data, error } = await supabase
    .from(TableName.branchMem)
    .select('id, roles(role)')
    .eq('org_mem_id', orgMemID)
    .eq('branch_id', branchID)
    .single();
    
  if(!error) return data;

  throw new ErrorII(error.message);
}

/**
 * 
 * @param branchID 
 * @param orgMemID 
 * @param role 
 * @param inviteID 
 * @param selectFields 
 * @returns 
 */
export const storeMembership = async (
  member: MemberInsert,
  ...selectFields: string[]
) => {
  const slctStr = selectFields.join(", ");

  const { data, error } = await supabase
    .from('branch_members')
    .insert(member)
    .select(slctStr);

  if (!error) return data[0];

  throw new InvalidCredentials(
    'Failed to store branch membership.'
  );
}

export const storeBranch = async (
  orgID: string,
  orgMemID: string,
  roleID: string,
  branch: BranchInsert
) => {
  const bdata = {
    ...sanitizeObject(branch),
    'org_id': orgID
  }

  const { data, error } = await supabase
    .from(TableName.branch)
    .insert(bdata)
    .select('id')
    .single();

  if (error) throw new ErrorII(error.message);

  await storeMembership({
    branch_id: data.id,
    org_mem_id: orgMemID,
    role_id: roleID,
    status: 'accepted'
  })
}

/**
 * 
 * @param id 
 * @param column 
 * @param single 
 * @returns 
 */
export const findMembership = async (
  id: string,
  column: 'id'|'branch_id'|'org_mem_id'|'invitation_id' = 'id',
  single = true
) => {
  let builder = supabase
    .from(TableName.branchMem)
    .select(`
      *,
      roles(role),
      branches(
        branch_name,
        organizations(org_name)
      ),
      organization_invitations(
        *,
        sender:users!organization_invitations_sender_id_fkey(
          email
        ),
        receiver:users!organization_invitations_receiver_id_fkey(
          firstname,
          email
        )
      )
    `)
    .eq(column, id);

  const { data, error } = single
    ? await builder.single()
    : await builder;

  if (!error) return data;

  throw new ErrorII(error.message);
}

export const findMembers = async ( 
  branchID: string, 
  options: BranchPagination
) => {
  const orderBy = options.orderBy
    ? options.orderBy
    : 'id';

  let builder = supabase
    .from(TableName.branchMem)
    .select(`
      id,
      org_mem_id,
      role,
      status,
      branches(
        branch_name,
        icon,
        color,
        status,
        org_id
      )
    `)
    .order(orderBy, { ascending: options.order === 'asc' })
    .eq('branch_id', branchID)
    .limit(options.pageSize + 1);

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

  return { data, hasNextPage, nextCursor }
}

/**
 * 
 * @param branch 
 * @param table 
 * @returns 
 */
export const save = async <T extends Record<string, any>>(
  id: string,
  branch: T,
  table: TableName
) => {
  const bdata = sanitizeObject(branch);
  bdata.updated_at = new Date();
  
  const { data, error } = await supabase
    .from(table)
    .update(bdata)
    .eq('id', id);
  
  return data;
}

export const deleteHandler = async (
  branchID: any,
  table: TableName,
  column: 'id' | 'branch_id' = 'id'
) => {
  if (typeof branchID !== 'string') {
    throw new InvalidCredentials(
      'ID must be a string.'
    );
  }

  const brcDB = new BaseRepository(table);

  await brcDB.delete(branchID, column);
}
