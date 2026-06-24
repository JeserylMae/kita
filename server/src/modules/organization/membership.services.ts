import { supabase } from "@/config/db";
import { InvalidCredentials } from "@/errors";


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
  public static async storeMember(
    orgID: string,
    userID: string,
    inviteID: string,
    employeeCode: string,
    employmentDate: Date
  ) {
    
    const orgs = await MembershipServices
      .getMembership(userID, 'id');

    const { data, error } = await supabase
      .from('organization_members')
      .insert({
        'org_id': orgID,
        'user_id': userID,
        'invitation_id': inviteID,
        'status': 'invited',
        'employee_code': employeeCode,
        'employment_date': employmentDate,
        'is_default_org': orgs.length === 0
      })
      .select('id');

    if (!error) return data[0]?.id;

    throw new InvalidCredentials('Failed to store organization membership.');
  }
}