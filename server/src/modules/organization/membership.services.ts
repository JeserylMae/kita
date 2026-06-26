import { supabase } from "@/config/db";
import { InvalidCredentials } from "@/errors";
import { OrgMembershipParams } from "./organization.types";
import { BaseRepository } from "../base/base.repository";


export class MembershipServices {
  /**
   * 
   * @param userID 
   * @param fields 
   * @returns 
   */
  public static async getMembership( 
    userID: string,
    ...fields: string[]  
  ) {
    const slctStr = fields.join(", ");

    const { data, error } = await supabase
      .from('organization_members')
      .select(slctStr)
      .eq('user_id', userID);

    if (!error) return data;

    throw error;
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
      .getMembership(userID, 'id');

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

  public static async update( 
    org: OrgMembershipParams 
  ) {
    const orgDB = new BaseRepository("organization_members");
    const data = await orgDB.upsert(org);

    return data;
  }
}