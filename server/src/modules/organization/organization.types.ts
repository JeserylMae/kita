
export enum TableName {
  org = 'organizations',
  founder = 'organization_founders',
  brand = 'organization_brands_subs',
  orgMem = 'organization_members',
  branch = 'branches',
  branchMem = 'branch_members',
  orgInv = 'organization_invitations'
};

export interface InvitationParams {
  id?: string;
  sender_id: string;
  receiver_id?: string;
  receiver_email: string;
  role_id: string;
  org_id: string;
  branch_id: string;
  status: string;
  url: string;
}

export interface InvitationUpdate {
  id: string;
  token: string;
  receiver_id?: string;
  org_id?: string;
  branch_id?: string;
  role_id?: string;
  expires_at?: Date;
  sent_at?: Date;
  status?: 'accepted' | 'rejected' | 're-invited';
}

export interface InvitationResponseParams {
  id: string;
  org_id: string;
  branch_id: string;
  role_id: string;
  receiver_id: string;
  accepted_at: Date | null;
  status?: 'accepted' | 'rejected' | 're-invited';
}

export interface InviteEmailParams {
  orgName: string;
  senderEmail: string;
  branchName: string;
  roleName: string;
  expirationDate: Date;
  acceptURL: string;
}

export interface Founder {
  id?: string;
  firstname: string;
  middlename?: string | null;
  lastname: string;
  suffix?: string | null;
}

export interface Brand {
  id?: string;
  org_id: string;
  name: string;
}

export interface OrgParams {
  id?: string;
  org_name: string;
  icon: string;
  hex_color: string;
  status: string;
  founded: Date;
  headquarters: string;
  address: string;
  website: string;
  industry: string;
}

export interface OrgMembershipParams {
  id?: string;
  org_id?: string;
  user_id?: string;
  invitation_id?: string;
  status?: string;
  employee_code?: string;
  employment_date?: Date;
  is_default_org?: boolean;
  updated_at?: Date;
}