import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { OrgMembershipParams } from "./organization.types";
import { InvalidCredentials, RecordNotFound } from "@/errors";


export class MembershipServices {
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
        is_default_org,
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
 
  /**
   * 
   * @param orgID 
   * @param userID 
   * @param inviteID 
   * @param employeeCode 
   * @param employmentDate 
   * @returns 
   */
  public static async store(
    orgID: string,
    userID: string,
    inviteID: string,
    employeeCode: string,
    employmentDate: Date,
    ...selectFields: string[]
  ) {   
    const slctStr = selectFields.join(", ");

    const rOrgs = await MembershipServices
      .findMembership(userID);

    const { data, error } = await supabase
      .from('organization_members')
      .upsert({
        'org_id': orgID,
        'user_id': userID,
        'invitation_id': inviteID,
        'status': 'invited',
        'employee_code': employeeCode,
        'employment_date': employmentDate,
        'is_default_org': rOrgs.length === 0
      }, {
        onConflict: 'user_id,org_id',
        ignoreDuplicates: true
      })
      .select(slctStr);

    if (!error) return data[0];

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
    const orgDB = new BaseRepository("organization_members");
    const data = await orgDB.upsert(org);

    return data;
  }
}


/**
 * CREATE INVITATIONS
 *  - create a record on:
 *      - org_mem
 *      - brc_mem
 * CREATE ORGANIZATIONS
 *  - create a record on:
 *      - org_mem
 */

/**
 * FETCH ORG EMPLOYEES
 * - from organizations
 * - join through org_mem(org_id)
 * 
 * FETCH USER'S ORGS 
 * - from org_mem
 * - join organizations(id)
 * 
 * FETCH USER'S ORGS + BRCS
 * - from org_mem
 * - select(
 *  *,
 *  organizations(
 *    *,
 *    branches (
 *      *,
 *      branch_mem(
 *        *
 *      )
 *    )
 *  )
 * )
 * 
 */