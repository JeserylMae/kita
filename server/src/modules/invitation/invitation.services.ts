import { supabase } from "@/config/db";
import { BaseRepository } from "../base/base.repository";
import { storeMembership } from "../branch/branch.services";
import { InviteEmailParams } from "../email/email.types";
import { renderInvite, sendEmail } from "../email/email.services";

import { 
  ConflictError,
  ErrorII,
  InvalidCredentials, 
  RecordNotFound 
} from "@/errors";
import { 
  getDateAfterInterval, 
  hasProperty, 
  sanitizeObject 
} from "@/utils/data.helpers";
import { 
  InvitationParams, 
  InvitationResponse, 
  InvitationUpdate, 
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

  if (!hasProperty(inviteData.org, "org_name")
    || !hasProperty(inviteData.sender, "email") 
    || !hasProperty(inviteData.brc, "branch_name")
    || !hasProperty(inviteData.role, "role")
  ) {
    throw new ConflictError(
      'Failed to fetch necessary data.'
    );
  }

  await sendInviteEmail(
    invite.receiver_email, {
    'orgName': inviteData.org.org_name,
    'senderEmail': inviteData.sender.email,
    'branchName': inviteData.brc.branch_name,
    'roleName': inviteData.role.role,
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
  
  if (error?.code === '23505') {
    throw new InvalidCredentials('Invitation already exists.');
  }

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
  const idata = await find(
    invitation.id,
    'id', 'token', 'expires_at', 'accepted_at'
  );
  
  if (idata.id.trim() === "") {
    throw new InvalidCredentials(
      'Invitation does not exist.'
    );
  }

  if (idata.accepted_at) {
    throw new ConflictError(
      'Invitation already accepted.'
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

  if ( invitation.status === 'accepted') {
    const org = await MembershipServices.store(
      invitation.org_id!,
      invitation.receiver_id!,
      invitation.status,
      'id'
    );

    if (!hasProperty(org[0], 'id')) {
      throw new ErrorII('Failed to accept or reject branch memership');
    }

    await storeMembership({
      branch_id: invitation.branch_id!,
      org_mem_id: org[0]?.id,
      role_id: invitation.role_id!,
      status: invitation.status
    });
  }

  const { data, error } =  await supabase
    .from(TableName.orgInv)
    .update({
      'status': invitation.status,
      'receiver_id': invitation.receiver_id,
      'accepted_at': invitation.status === 'accepted'
        ? new Date() : null
    })
    .eq('id', invitation.id)
    .eq('org_id', invitation.org_id)
    .eq('branch_id', invitation.branch_id);

  if (error) throw new ErrorII(error.message);
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

export const findInvitations = async (
  id: string,
  column: 'id'|'branch_id'|'org_mem_id'|'invitation_id'|'receiver_id' = 'id',
  single = true
) => {
  let builder = supabase 
  .from(TableName.orgInv)
  .select(`
    id, 
    sender:users!sender_id(email, firstname, lastname),
    org:organizations!org_id(id, org_name),
    brc:branches!branch_id(id, branch_name),
    role:roles!role_id(id, role),
    status,
    sent_at,
    expires_at  
  `)
  .eq(column, id);
  
  const { data, error } = single
    ? await builder.single()
    : await builder;

  if (!error) return data;

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
