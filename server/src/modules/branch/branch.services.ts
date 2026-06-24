import { supabase } from "@/config/db";
import { InvalidCredentials, RecordNotFound } from "@/errors";


export class BranchServices {
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
}