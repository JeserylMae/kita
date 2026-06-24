import { supabase } from "@/config/db";
import { Invitation, InvitationUpdate, InviteEmailParams } from "./organization.types";
import { UserServices } from "../user/user.services";
import { TokenServices } from "../token/token.services";
import { getDateAfterInterval, sanitizeObject } from "@/utils/data.helpers";
import { MembershipServices } from "./membership.services";
import { BranchServices } from "../branch/branch.services";
import { InvalidCredentials, RecordNotFound } from "@/errors";
import { sendEmail } from "../email/email.services";
import { inviteTemplate } from "@/utils/template.helper";


const DB_TABLE = 'organization_invitations';

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
      .findByEmail(invite.receiverEmail, 'id', 'firstname');
    
    const token = TokenServices.createToken();
    const expiresAt = getDateAfterInterval(new Date(), '3d');

    const inviteID = await InvitationServices.store(
      senderID,
      receiver.id!,
      token,
      expiresAt
    );
  
    const org = await MembershipServices.store(
      invite.organizationID,
      receiver.id!,
      inviteID,
      invite.employeCode,
      invite.employmentDate,
      'id', 'organizations(org_name)'
    ) as unknown as { 
      'id': string, 
      'organizations': { 'org_name': string} 
    };

    const brc = await BranchServices
      .storeMembership(
        invite.branchID,
        org.id,
        invite.role,
        inviteID,
        'id', 'role', 'branches(branch_name)'
      ) as unknown as {
        'id': string,
        'role': string,
        'branches': { 'branch_name': string }
      };
    
    await InvitationServices.sendInviteEmail(
      invite.receiverEmail, {
      'orgName': org.organizations.org_name,
      'receiverName': receiver.firstname!,
      'senderEmail': invite.senderEmail,
      'branchName': brc.branches.branch_name,
      'roleName': brc.role,
      'expirationDate': expiresAt,
      'acceptURL': `${invite.url}/invite?token=${token}`
    })
  }

  /**
   * 
   * @param receiverEmail 
   * @param invite 
   */
  public static async sendInviteEmail(
    receiverEmail: string, 
    invite: InviteEmailParams
  ) {
    const subject = `Kita - You've Been Invited to Join ${invite.orgName}`;
    const content = inviteTemplate(invite);

    await sendEmail(receiverEmail, subject, content);
  }

  /**
   * 
   * @param senderID 
   * @param receiverID 
   * @param token 
   * @param expiresAt 
   * @returns 
   */
  public static async store( 
    senderID: string, 
    receiverID: string,
    token: string,
    expiresAt: Date
  ) {
    const { data, error } = await supabase
      .from(DB_TABLE)
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

  /**
   * 
   * @param inviteID 
   */
  public static async reInvite( inviteID: string ) {
    const token = TokenServices.createToken();
    const expiresAt = getDateAfterInterval( new Date(), '3d' );

    await InvitationServices.update(inviteID, {
      'token': token,
      'status': 're-invited',
      'expires_at': expiresAt
    });
  }

  /**
   * 
   * @param inviteID 
   * @param status 
   */
  public static async respond(
    receiver_id: string,
    inviteID: string,
    status: 'accepted' | 'rejected',
    token: string
  ) {
    // @TODO: Update branch_members status
    // @TODO: update organization_members status

    await InvitationServices.update(inviteID, {
      'status': status,
      'token': token,
      'accepted_at': status === 'accepted'? new Date() : null
    });
  }

  /**
   * 
   * @param inviteID 
   * @param invite 
   * @returns 
   */
  public static async update(
    inviteID: string, 
    invite: InvitationUpdate
  ) {
    const inviteData = sanitizeObject(invite);

    const { data, error } = await supabase
      .from(DB_TABLE)
      .update(inviteData)
      .eq('id', inviteID);

    if (!error) return;

    throw new RecordNotFound(
      `Invitation with ID ${inviteID} is not found.` 
    );
  }
}