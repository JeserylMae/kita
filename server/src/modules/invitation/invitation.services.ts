import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { storeMembership } from "../branch/branch.services";
import { renderInvite, sendEmail } from "../email/email.services";

import { 
  ErrorII,
  InvalidCredentials, 
  RecordNotFound 
} from "@/errors";
import { 
  getDateAfterInterval, 
  sanitizeObject 
} from "@/utils/data.helpers";
import { 
  InvitationParams, 
  InvitationResponse, 
  InvitationUpdate, 
  InviteEmailParams, 
  TableName
} from "../organization/organization.types";

import * as TokenServices from "../token/token.services";
import * as MembershipServices from "../organization/membership.services";


const DB_TABLE = 'organization_invitations';

  /**
 * 
 * @param senderID 
 * @param invite 
 */
export const createInvitation = async ( 
  invite: InvitationParams
) => {
  const token = TokenServices.createToken();
  const expiresAt = getDateAfterInterval(new Date(), '3d');

  const inviteData = await store(invite, token, expiresAt);
  
  await sendInviteEmail(
    invite.receiver_email, {
    'orgName': inviteData.org[0]!.org_name,
    'senderEmail': inviteData.sender[0]!.email,
    'branchName': inviteData.brc[0]!.branch_name,
    'roleName': inviteData.role[0]!.role,
    'expirationDate': expiresAt,
    'acceptURL': `${invite.url}/invite?token=${token}`
  })
}

/**
 * 
 * @param senderID 
 * @param receiverID 
 * @param token 
 * @param expiresAt 
 * @returns 
 */
export const store = async ( 
  invitation: InvitationParams,
  token: string,
  expiresAt: Date
) => {
  const { data, error } = await supabase
    .from(DB_TABLE)
    .insert({
      'sender_id': invitation.sender_id,
      'receiver_email': invitation.receiver_email,
      'role_id': invitation.role_id,
      'org_id': invitation.org_id,
      'branch_id': invitation.branch_id,
      'token': token,
      'status': 'invited',
      'expires_at': expiresAt,
      'sent_at': new Date()
    })
    .select(`
      sender:users!sender_id(email),
      org:organizations!org_id(org_name),
      brc:branches!branch_id(branch_name),
      role:roles!role_id(role)
    `)
    .single();
  
  if (!error) return data;

  throw new InvalidCredentials('Failed to create invitation.');
}

/**
 * 
 * @param inviteID 
 * @param inviteURL 
 */
export const reInvite = async ( 
  inviteID: string, 
  inviteURL: string 
) => {
  const token = TokenServices.createToken();
  const expiresAt = getDateAfterInterval( new Date(), '3d' );

  const invitation = await update(inviteID, {
    'id': inviteID,
    'token': token,
    'status': 're-invited',
    'expires_at': expiresAt.toISOString(),
    'sent_at': new Date().toISOString()
  });

  await sendInviteEmail(
    invitation.receiver_email, {
      'orgName': invitation.org[0]!.org_name,
      'senderEmail': invitation.sender[0]!.email,
      'branchName': invitation.brc[0]!.branch_name,
      'roleName': invitation.role[0]!.role,
      'expirationDate': expiresAt,
      'acceptURL': `${inviteURL}/invite?token=${token}`,
    }
  )
}

export const respond = async (
  invitation: InvitationResponse,
  token: string
) => {
  const invDB = new BaseRepository(TableName.orgInv);

  const idata = await find(
    invitation.id,
    'id', 'token', 'expires_at'
  );
  
  if (idata.id.trim() === "") {
    throw new InvalidCredentials(
      'Invitation does not exists.'
    );
  }

  if (idata.token !== token) {
    throw new InvalidCredentials(
      'Incorrect token.'
    );
  }
  
  TokenServices.verify({
    'isavailable': true,
    'expires_at': new Date(idata.expires_at!)
  })

  if (invitation.status === 'accepted') {
    const org = await MembershipServices.store(
      invitation.org_id!,
      invitation.receiver_id!,
      'id'
    );

    await storeMembership({
      branch_id: invitation.branch_id!,
      org_mem_id: org.id!,
      role_id: invitation.role_id!,
      status: invitation.status
    });
  }

  await invDB.upsert({
    'id': invitation.id,
    'status': invitation.status,
    'accepted_at': invitation.status === 'accepted'
      ? new Date() : null
  })
}

/**
 * 
 * @param receiverEmail 
 * @param invite 
 */
export const sendInviteEmail = async (
  receiverEmail: string, 
  invite: InviteEmailParams
) => {
  const subject = `Kita - You've Been Invited to Join ${invite.orgName}`;
  const content = renderInvite(invite);

  await sendEmail(receiverEmail, subject, content);
}

export const find = async <K extends keyof InvitationUpdate>(
  inviteID: string,
  ...fields: K[]
) => {
  const slctStr = fields.join(', ');

  const { data, error } = await supabase
    .from(TableName.orgInv)
    .select(slctStr)
    .eq('id', inviteID)
    .single();

  if (!error) return data as unknown as Pick<InvitationUpdate, K>;

  throw new ErrorII(error.message);
}

/**
 * 
 * @param inviteID 
 * @param invite 
 * @returns 
 */
export const update = async (
  inviteID: string, 
  invite: InvitationUpdate
) => {
  const inviteData = sanitizeObject(invite);

  const { data, error } = await supabase
    .from(DB_TABLE)
    .update(inviteData)
    .select(`
      receiver_email,
      sender:users!sender_id(email),
      org:organizations!org_id(org_name),
      brc:branches!branch_id(branch_name),
      role:roles!role_id(role)
    `)
    .eq('id', inviteID)
    .single();

  if (!error) return data;

  throw new RecordNotFound(
    `Invitation with ID ${inviteID} is not found.` 
  );
}

export const deleteInvitation = async ( inviteID: string ) => {
  const invDB = new BaseRepository(TableName.orgInv);
  await invDB.delete(inviteID);
}
