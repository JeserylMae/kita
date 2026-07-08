import * as z from 'zod';
import * as schema from './organization.schemas';


export enum TableName {
  org =       'organizations',
  founder =   'organization_founders',
  brand =     'organization_brands_subs',
  orgMem =    'organization_members',
  branch =    'branches',
  branchMem = 'branch_members',
  orgInv =    'organization_invitations'
};

export interface InviteEmailParams {
  orgName:        string;
  senderEmail:    string;
  branchName:     string;
  roleName:       string;
  expirationDate: Date;
  acceptURL:      string;
}

export interface MembershipSelect {
  id?:              string;
  org_id?:          string;
  user_id?:         string;   
  status?:          string;
  employee_code?:   string;
  employment_date?: Date;
  role?:            'owner' | 'admin' | 'member';
  updated_at?:      Date;
}

export type InvitationParams   = z.infer<typeof schema.InvitationParamsSchema>;

export type InvitationUpdate   = z.infer<typeof schema.InvitationUpdateSchema>; 

export type InvitationResponse = z.infer<typeof schema.InvitationResponseSchema>;

export type BrandInsert        = z.infer<typeof schema.BrandInsertSchema>;

export type BrandUpdate        = z.infer<typeof schema.BrandUpdateSchema>;

export type FounderInsert      = z.infer<typeof schema.FounderInsertSchema>;

export type FounderUpdate      = z.infer<typeof schema.FounderUpdateSchema>;

export type OrgInsert          = z.infer<typeof schema.OrgInsertSchema>;

export type OrgUpdate          = z.infer<typeof schema.OrgUpdateSchema>; 

export type MembershipInsert   = z.infer<typeof schema.MembershipInsertSchema>;

export type MembershipUpdate   = z.infer<typeof schema.MembershipUpdateSchema>;

export type OrgInsertRequest   = z.infer<typeof schema.OrgInsertRequestSchema>;

export type OrgUpdateRequest   = z.infer<typeof schema.OrgUpdateRequestSchema>;