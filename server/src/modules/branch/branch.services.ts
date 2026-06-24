import { supabase } from "@/config/db";
import { InvalidCredentials, RecordNotFound } from "@/errors";


export class BranchServices {
  public static async storeMembership(
    branchID: string,
    orgMemID: string,
    role: string,
    inviteID: string
  ) {
    const { data, error } = await supabase
      .from('branch_members')
      .insert({
        'branch_id': branchID,
        'org_mem_id': orgMemID,
        'role': role,
        'status': 'invited',
        'invitation_id': inviteID
      })
      .select('id');

    if (!error) return data[0]?.id;

    throw new InvalidCredentials(
      'Failed to store branch membership.'
    );
  }
}