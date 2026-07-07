import { supabase } from "@/config/db";
import { TableName } from "../organization/organization.types";
import { sanitizeObject } from "@/utils/data.helpers";
import { BaseRepository } from "../base/base.repository";

import { 
  BrcMemberParams, 
  BrcParams 
} from "./branch.types";
import { 
  ErrorII, 
  InvalidCredentials 
} from "@/errors";



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
    .select('roles(role)')
    .eq('org_mem_id', orgMemID)
    .eq('branch_id', branchID)
    .single();
    
  if(!error) return data?.roles[0] ?? null;

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
  branchID: string,
  orgMemID: string,
  roleID: string,
  ...selectFields: string[]
) => {
  const slctStr = selectFields.join(", ");

  const { data, error } = await supabase
    .from('branch_members')
    .upsert({
      'branch_id': branchID,
      'org_mem_id': orgMemID,
      'role_id': roleID,
      'status': 'accepted'
    }, {
      onConflict: 'org_mem_id,branch_id',
      ignoreDuplicates: true
    })
    .select(slctStr);

  if (!error) return data[0];

  throw new InvalidCredentials(
    'Failed to store branch membership.'
  );
}

export const storeBranch = async (
  branch: BrcParams,
  brcmem: BrcMemberParams
) => {
  const data = (await save(branch, TableName.branch))[0];

  brcmem.branch_id = data.id;
  await save(brcmem, TableName.branchMem);
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
  branchID: string 
) => {
  const { data, error } = await supabase
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
    .eq('branch_id', branchID);
  
  if (!error) return data;

  throw new ErrorII(error.message);
}

/**
 * 
 * @param branch 
 * @param table 
 * @returns 
 */
export const save = async <T extends Record<string, any>>(
  branch: T,
  table: TableName
) => {
  const brcDB = new BaseRepository(table);
  const bdata = sanitizeObject(branch);

  bdata.updated_at = new Date();
  const data = await brcDB.upsert(bdata);
  
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
