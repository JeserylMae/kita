import { supabase } from "@/config/db";
import { RecordNotFound } from "@/errors";


export class OrganizationService {
  /**
   * 
   * @param userID 
   * @param options 
   * @returns 
   */
  public static async getOrganizations(
    userID: string,
    options?: {
      withBranches?: boolean,
      defaultOrgOnly?: boolean
    }
  ) {
    /**
     * organization_members.org_id = organizations.id
     */
    let slctStr = (`
      org_id,
      is_default_org,
      employee_code,
      status,
      organizations( org_name, icon, hex_color )
    `);

    if (options?.withBranches) {
      /**
       * organization_members.id = branch_members.org_mem_id
       * branch_members.branch_id = branches-id
       */
      slctStr += (`
        ,
        branch_members (
          branch_id,
          role,
          status,
          starred,
          branches( branch_name, icon, color )
        )
      `);
    }

    let query = options?.withBranches ?
      supabase
        .from('organization_members')
        .select(slctStr)
        .eq('user_id', userID)
        .eq('organizations.status', 'active')
        .eq('branches.status', 'active')
      : supabase 
        .from('organization_members')
        .select(slctStr)
        .eq('user_id', userID)
        .eq('organizations.status', 'active');
    
    query = options?.defaultOrgOnly ?
      query.eq('is_default_org', true)
      : query;

    query.eq('status', 'active');

    const { data, error } = await query;
    
    if (!error) return data;
    
    throw new RecordNotFound('Failed to fetch organization list.');
  }
}
