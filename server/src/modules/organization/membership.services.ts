import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { OrgMembershipParams, TableName } from "./organization.types";
import { ErrorII, InvalidCredentials, RecordNotFound } from "@/errors";
import { sanitizeObject } from "@/utils/data.helpers";


export class MembershipServices {
  public static async findRole( 
    userID: string,
    defaultOrg: string 
  ) {
    const { data, error } = await supabase
      .from(TableName.orgMem)
      .select('id, roles(role)')
      .eq('user_id', userID)
      .eq('org_id', defaultOrg)
      .single();

    if(!error) return data;

    throw new ErrorII(error.message);
  }

  /**
   * 
   * @param userID 
   * @param options 
   * @returns 
   */
  public static async findMembership(
    userID: string,
    options?: {
      withBranches?: boolean,
      defaultOrgOnly?: boolean
    }
  ) {
    // organization_members.org_id = organizations.id
    let slctStr = (`
      org_id,
      employee_code,
      status,
      organizations( org_name, icon, hex_color )
    `);

    if (options?.withBranches) {
      // organization_members.id = branch_members.org_mem_id
      // branch_members.branch_id = branches-id
      slctStr += (`
        ,
        branch_members (
          branch_id,
          role(role),
          status,
          starred,
          branches( branch_name, icon, color )
        )
      `);
    }

    let buidler = supabase 
      .from('organization_members')
      .select(slctStr)
      .eq('user_id', userID)
      .eq('organizations.status', 'active')
      .eq('status', 'active');
  
    buidler = options?.withBranches
      ? buidler.eq('branches.status', 'active')
      : buidler;
    
    buidler = options?.defaultOrgOnly 
      ? buidler.eq('is_default_org', true)
      : buidler;

    const { data, error } = await buidler;
    
    if (!error) return data;
    
    throw new RecordNotFound(
      'Failed to fetch organization list.'
    );
  }

  public static async findAllMembers( orgID: string ) {
    const { data, error } = await supabase
      .from(TableName.orgMem)
      .select(`
        id,
        user_id,
        users(
          firstname,
          middlename,
          lastname, 
          suffix,
          house_number,
          street,
          barangay,
          city,
          province,
          region,
          birthdate,
          email
        ),
        status,
        employee_code,
        employment_date,
        updated_at
      `)
      .eq('org_id', orgID);
    
    if (!error) return data;

    throw new ErrorII(error.message);
  }

  /**
   * 
   * @param orgID 
   * @param userID 
   * @param inviteID 
   * @param employeeCode 
   * @param employmentDate 
   * @returns 
   */
  public static async store<K extends keyof OrgMembershipParams>(
    orgID: string,
    userID: string,
    ...selectFields: K[]
  ) {   
    const slctStr = selectFields.join(", ");

    const rOrgs = await MembershipServices
      .findMembership(userID);

    const { data, error } = await supabase
      .from('organization_members')
      .upsert({
        'org_id': orgID,
        'user_id': userID,
        'status': 'accepted'
      }, {
        onConflict: 'user_id,org_id',
        ignoreDuplicates: true
      })
      .select(slctStr)
      .single();

    if (!error) return data as unknown as Pick<OrgMembershipParams, K>;

    throw new InvalidCredentials(
      'Failed to store organization membership.'
    );
  }

  /**
   * 
   * @param org 
   * @returns 
   */
  public static async update( 
    org: OrgMembershipParams 
  ) {
    const orgDB = new BaseRepository(TableName.orgMem);

    org.updated_at = new Date();
  
    const odata = sanitizeObject(org);
    const data = await orgDB.upsert(odata);

    return data;
  }

  public static async delete( memberID: any ) {
    if (typeof memberID !== 'string') {
      throw new InvalidCredentials(
        'Member ID must be a string.'
      );
    }

    const orgDB = new BaseRepository(TableName.orgMem);

    await orgDB.delete(memberID);
  }
}
