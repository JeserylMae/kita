import { supabase } from "@/config/db";
import { ErrorII, InvalidCredentials } from "@/errors";
import { BrcMemberParams } from "./branch.types";
import { BaseRepository } from "../base/base.repository";
import { TableName } from "../organization/organization.types";
import { sanitizeObject } from "@/utils/data.helpers";


export class BranchServices {
  /**
   * 
   * @param branchID 
   * @param orgMemID 
   * @param role 
   * @param inviteID 
   * @param selectFields 
   * @returns 
   */
  public static async storeMembership(
    branchID: string,
    orgMemID: string,
    role: string,
    inviteID: string,
    ...selectFields: string[]
  ) {
    const slctStr = selectFields.join(", ");

    const { data, error } = await supabase
      .from('branch_members')
      .upsert({
        'branch_id': branchID,
        'org_mem_id': orgMemID,
        'role': role,
        'status': 'invited',
        'invitation_id': inviteID
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

  /**
   * 
   * @param id 
   * @param column 
   * @param single 
   * @returns 
   */
  public static async findMembership(
    id: string,
    column: 'id'|'branch_id'|'org_mem_id'|'invitation_id' = 'id',
    single = true
  ) {
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

  public static async findMembers( branchID: string ) {
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
  public static async save<T extends Record<string, any>>(
    branch: T,
    table: TableName
  ) {
    const brcDB = new BaseRepository(table);
    const bdata = sanitizeObject(branch);

    bdata.updated_at = new Date();
    const data = await brcDB.upsert(bdata);
    
    return data;
  }

  public static async delete(
    branchID: any,
    table: TableName,
    column: 'id' | 'branch_id' = 'id'
  ) {
    if (typeof branchID !== 'string') {
      throw new InvalidCredentials(
        'ID must be a string.'
      );
    }

    const brcDB = new BaseRepository(table);

    await brcDB.delete(branchID, column);
  }
}