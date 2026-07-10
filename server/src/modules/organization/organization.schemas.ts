import * as z from  'zod';


export const InvitationParamsSchema = z.object({
  id:             z.uuid().optional(),
  sender_id:      z.uuid(),
  receiver_id:    z.uuid().optional(),
  receiver_email: z.email(),
  role_id:        z.uuid(),
  org_id:         z.uuid(),
  branch_id:      z.uuid(),
  status:         z.string(),
  url:            z.url()
});

export const InvitationUpdateSchema = z.object({
  id:          z.uuid(),
  token:       z.string(),
  receiver_id: z.uuid().optional(),
  org_id:      z.uuid().optional(),
  branch_id:   z.uuid().optional(),
  role_id:     z.uuid().optional(),
  expires_at:  z.iso.datetime().optional(),
  sent_at:     z.iso.datetime().optional(),
  status:      z.enum(['accepted', 'rejected', 're-invited']).optional()
});

export const InvitationResponseSchema = z.object({
  id:          z.uuid(),
  org_id:      z.uuid(),
  branch_id:   z.uuid(),
  role_id:     z.uuid(),
  receiver_id: z.uuid(),
  accepted_at: z.iso.datetime().optional(),
  status:      z.enum(['accepted', 'rejected', 're-invited']).optional()
});

export const BrandInsertSchema = z.object({
  org_id: z.uuid(),
  name:   z.string()
});

export const BrandUpdateSchema = z.object({
  id:     z.uuid(),
  org_id: z.uuid(),
  name:   z.string()
});


export const FounderInsertSchema = z.object({
  firstname:  z.string(),
  middlename: z.string().optional(),
  lastname:   z.string(),
  suffix:     z.string().optional()
});

export const FounderUpdateSchema = z.object({
  id:         z.uuid(),
  firstname:  z.string().optional(),
  middlename: z.string().optional(),
  lastname:   z.string().optional(),
  suffix:     z.string().optional()
});

export const OrgInsertSchema = z.object({
  org_name:     z.string(),
  icon:         z.string().optional(),
  hex_color:    z.string().optional(),
  status:       z.string().optional(),
  founded:      z.iso.date().optional(),
  headquarters: z.string().optional(),
  address:      z.string().optional(),
  website:      z.url().optional(),
  industry:     z.string().optional()
});

export const OrgUpdateSchema = z.object({
  org_name:     z.string().optional(),
  icon:         z.string().optional(),
  hex_color:    z.string().optional(),
  status:       z.string().optional(),
  founded:      z.iso.date().optional(),
  headquarters: z.string().optional(),
  address:      z.string().optional(),
  website:      z.url().optional(),
  industry:     z.string().optional()
});

export const MembershipInsertSchema = z.object({
  status:          z.string(),
  employee_code:   z.string().optional(),
  employment_date: z.iso.date().optional(),
  role:            z.enum(['owner', 'admin', 'member']).optional()
});

export const MembershipUpdateSchema = z.object({
  status:          z.string().optional(),
  employee_code:   z.string().optional(),
  employment_date: z.iso.date().optional(),
  role:            z.enum(['owner', 'admin', 'member']).optional(),
  updated_at:      z.iso.datetime().optional()
});

export const OrgInsertRequestSchema = z.object({
  organization: OrgInsertSchema,
  brands:       BrandInsertSchema.array(), 
  founders:     FounderInsertSchema.array(),
  membership:   MembershipInsertSchema
});

export const OrgUpdateRequestSchema = z.object({
  organization: OrgUpdateSchema.optional(),
  brands:       BrandUpdateSchema.array().optional(), 
  founders:     FounderUpdateSchema.array().optional(),
});
