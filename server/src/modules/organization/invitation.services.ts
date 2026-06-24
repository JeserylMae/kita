import { supabase } from "@/config/db";
import { Invitation } from "./organization.types";
import { UserServices } from "../user/user.services";
import { TokenServices } from "../token/token.services";
import { getDateAfterInterval } from "@/utils/data.helpers";
import { MembershipServices } from "./membership.services";
import { BranchServices } from "../branch/branch.services";
import { InvalidCredentials } from "@/errors";


export class InvitationServices {
    /**
   * 
   * @param senderID 
   * @param invite 
   */
  public static async createInvitation( 
    senderID: string, 
    invite: Invitation 
  ) {
    const receiver = await UserServices
      .findByEmail(invite.receiverEmail, 'id');
    
    const token = TokenServices.createToken();
    const expiresAt = getDateAfterInterval(new Date(), '3d');

    const inviteID = await InvitationServices
      .storeInvitation(
        senderID,
        receiver.id!,
        token,
        expiresAt
      )

    const orgMemID = await MembershipServices
      .storeMember(
        invite.organizationID,
        receiver.id!,
        inviteID,
        invite.employeCode,
        invite.employmentDate
      );

    const __ = await BranchServices
      .storeMembership(
        invite.branchID,
        orgMemID,
        invite.role,
        inviteID
      );
  }

  /**
   * 
   * @param senderID 
   * @param receiverID 
   * @param token 
   * @param expiresAt 
   * @returns 
   */
  public static async storeInvitation( 
    senderID: string, 
    receiverID: string,
    token: string,
    expiresAt: Date
  ) {
    const { data, error } = await supabase
      .from('organization_invitations')
      .insert({
        'sender_id': senderID,
        'receiver_id': receiverID,
        'token': token,
        'status': 'invited',
        'expires_at': expiresAt,
        'accepted_at': null
      })
      .select('id');
    
    if (!error) return data[0]?.id;

    throw new InvalidCredentials('Failed to create invitation.');
  }
}