
export enum TableName {
  org = 'organizations',
  founder = 'organization_founders',
  brand = 'organization_brands_subs',
  branch = 'branches',
  branchMem = 'branch_members'
};

export interface Invitation {
  senderEmail: string;
  receiverEmail: string;
  organizationID: string;
  branchID: string;
  role: string;
  employeCode: string; 
  employmentDate: Date;
  url: string;
}

export interface InvitationUpdate {
  token?: string;
  status: 'accepted' | 'rejected' | 're-invited';
  expires_at?: Date;
  accepted_at?: Date | null;
}

export interface InviteEmailParams {
  orgName: string;
  receiverName: string;
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
  founders: Founder[];
  brands: Brand[];
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