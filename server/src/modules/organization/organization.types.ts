
export enum TableName {
  org = 'organizations',
  founder = 'organization_founders',
  brand = 'organization_brands_subs',
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
  founders: Founder[];
  brands: Brand[];
}