
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

export interface BrandInsert {
  org_id: string;
  name: string;
}

export interface BrandUpdate {
  id: string;
  org_id: string;
  name: string;
}

export interface FounderInsert {
  firstname: string;
  middlename?: string | null;
  lastname: string;
  suffix?: string | null;
}

export interface FounderUpdate {
  id: string;
  firstname?: string;
  middlename?: string | null;
  lastname?: string;
  suffix?: string | null;
}

export interface OrgInsert {
  org_name: string;
  icon?: string;
  hex_color?: string;
  status?: string;
  founded?: Date;
  headquarters?: string;
  address?: string;
  website?: string;
  industry?: string;
}

export interface OrgUpdate {
  org_name?: string;
  icon?: string;
  hex_color?: string;
  status?: string;
  founded?: Date;
  headquarters?: string;
  address?: string;
  website?: string;
  industry?: string;
}

export interface MembershipSelect {
  id?: string;
  org_id?: string;
  user_id?: string;   
  status?: string;
  employee_code?: string;
  employment_date?: Date;
  role?: 'owner' | 'admin' | 'member';
  updated_at?: Date;
}

export interface MembershipInsert {  
  status: string;
  employee_code?: string;
  employment_date?: Date;
  role?: 'owner' | 'admin' | 'member';
}

export interface MembershipUpdate {
  status?: string;
  employee_code?: string;
  employment_date?: Date;
  role?: 'owner' | 'admin' | 'member';
  updated_at?: Date;
}