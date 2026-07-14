import * as z from  'zod';

import {
  UUID,
  OrgID,
  BranchID,
  RoleID,
  Email,
  Token,
  ExpiresAt,
  UpdatedAt,
  URL
} from '@/modules/base/base.schemas';


const SenderID = z.uuid().meta({
  description: "UUID of the user sending the invitation",
  example: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
});

const ReceiverID = z.uuid().meta({
  description: "UUID of the invited user, if already registered",
  example: "16fd2706-8baf-433b-82eb-8c7fada847da",
});

const ReceiverEmail = Email.meta({
  description: "Email address of the invitee",
  example: "invitee@example.com",
});

const InvitationStatus = z.enum(['accepted', 'rejected', 're-invited']).meta({
  description: "Current status of the invitation",
  example: "accepted",
});

const SentAt = z.iso.datetime().meta({
  description: "Timestamp the invitation was sent",
  example: "2025-12-01T09:00:00Z",
});

const AcceptedAt = z.iso.datetime().meta({
  description: "Timestamp the invitation was accepted",
  example: "2025-12-02T10:15:00Z",
});

const InvitationURL = URL.meta({
  description: "URL used to accept the invitation",
  example: "https://app.example.com/invite/accept?token=abc123",
});

const OrgName = z.string().meta({
  description: "Organization name",
  example: "Acme Corporation",
});

const Icon = z.string().meta({
  description: "URL or identifier of the organization's icon/logo",
  example: "https://cdn.example.com/icons/acme.png",
});

const HexColor = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).meta({
  description: "Brand color in hex format",
  example: "#1A73E8",
});

const OrgStatus = z.string().meta({
  description: "Operating status of the organization",
  example: "active",
});

const FoundedDate = z.iso.date().meta({
  description: "Date the organization was founded",
  example: "1999-05-20",
});

const Headquarters = z.string().meta({
  description: "Headquarters location",
  example: "Manila, Philippines",
});

const Address = z.string().meta({
  description: "Full business address",
  example: "123 Rizal Street, Batangas City",
});

const Industry = z.string().meta({
  description: "Industry the organization operates in",
  example: "Retail",
});

const BrandName = z.string().meta({
  description: "Brand or sub-brand name",
  example: "Acme Foods",
});

const FounderFirstName = z.string().meta({
  description: "Founder's first name",
  example: "Juan",
});

const FounderMiddleName = z.string().meta({
  description: "Founder's middle name",
  example: "Santos",
});

const FounderLastName = z.string().meta({
  description: "Founder's last name",
  example: "Dela Cruz",
});

const FounderSuffix = z.string().meta({
  description: "Name suffix",
  example: "Jr.",
});

const MembershipStatus = z.string().meta({
  description: "Status of the organization membership",
  example: "active",
});

const EmployeeCode = z.string().meta({
  description: "Internal employee code",
  example: "EMP-00123",
});

const EmploymentDate = z.iso.date().meta({
  description: "Date the member was employed",
  example: "2022-03-01",
});

const MembershipRole = z.enum(['owner', 'admin', 'member']).meta({
  description: "Role of the member within the organization",
  example: "member",
});


export const InvitationParamsSchema = z.object({
  id:             UUID.optional(),
  sender_id:      SenderID,
  receiver_id:    ReceiverID.optional(),
  receiver_email: ReceiverEmail,
  role_id:        RoleID,
  org_id:         OrgID,
  branch_id:      BranchID,
  status:         InvitationStatus,
  url:            InvitationURL
}).meta({
  id: "InvitationParams",
  title: "Invitation Parameters",
  description: "Schema for creating an organization invitation.",
});

export const InvitationUpdateSchema = z.object({
  id:          UUID,
  token:       Token,
  receiver_id: ReceiverID.optional(),
  org_id:      OrgID.optional(),
  branch_id:   BranchID.optional(),
  role_id:     RoleID.optional(),
  expires_at:  ExpiresAt.optional(),
  sent_at:     SentAt.optional(),
  status:      InvitationStatus.optional()
}).meta({
  id: "InvitationUpdate",
  title: "Invitation Update",
  description: "Schema for updating an existing invitation.",
});

export const InvitationResponseSchema = z.object({
  id:          UUID,
  org_id:      OrgID,
  branch_id:   BranchID,
  role_id:     RoleID,
  receiver_id: ReceiverID,
  accepted_at: AcceptedAt.optional(),
  status:      InvitationStatus.optional()
}).meta({
  id: "InvitationResponse",
  title: "Invitation Response",
  description: "Schema representing a resolved invitation (accepted/rejected).",
});


export const BrandInsertSchema = z.object({
  org_id: OrgID,
  name:   BrandName
}).meta({
  id: "BrandInsert",
  title: "Brand Insert",
  description: "Schema for creating a new brand/sub-brand under an organization.",
});

export const BrandUpdateSchema = z.object({
  id:     UUID,
  org_id: OrgID,
  name:   BrandName
}).meta({
  id: "BrandUpdate",
  title: "Brand Update",
  description: "Schema for updating an existing brand/sub-brand.",
});


export const FounderInsertSchema = z.object({
  firstname:  FounderFirstName,
  middlename: FounderMiddleName.optional(),
  lastname:   FounderLastName,
  suffix:     FounderSuffix.optional()
}).meta({
  id: "FounderInsert",
  title: "Founder Insert",
  description: "Schema for adding a founder to an organization.",
});

export const FounderUpdateSchema = z.object({
  id:         UUID,
  firstname:  FounderFirstName.optional(),
  middlename: FounderMiddleName.optional(),
  lastname:   FounderLastName.optional(),
  suffix:     FounderSuffix.optional()
}).meta({
  id: "FounderUpdate",
  title: "Founder Update",
  description: "Schema for updating an existing founder's information.",
});


export const OrgInsertSchema = z.object({
  org_name:     OrgName,
  icon:         Icon.optional(),
  hex_color:    HexColor.optional(),
  status:       OrgStatus.optional(),
  founded:      FoundedDate.optional(),
  headquarters: Headquarters.optional(),
  address:      Address.optional(),
  website:      URL.optional(),
  industry:     Industry.optional()
}).meta({
  id: "OrgInsert",
  title: "Organization Insert",
  description: "Schema for creating a new organization.",
});

export const OrgUpdateSchema = z.object({
  org_name:     OrgName.optional(),
  icon:         Icon.optional(),
  hex_color:    HexColor.optional(),
  status:       OrgStatus.optional(),
  founded:      FoundedDate.optional(),
  headquarters: Headquarters.optional(),
  address:      Address.optional(),
  website:      URL.optional(),
  industry:     Industry.optional()
}).meta({
  id: "OrgUpdate",
  title: "Organization Update",
  description: "Schema for updating an existing organization's information.",
});


export const MembershipInsertSchema = z.object({
  status:          MembershipStatus,
  employee_code:   EmployeeCode.optional(),
  employment_date: EmploymentDate.optional(),
  role:            MembershipRole.optional()
}).meta({
  id: "MembershipInsert",
  title: "Membership Insert",
  description: "Schema for creating a new organization membership.",
});

export const MembershipUpdateSchema = z.object({
  status:          MembershipStatus.optional(),
  employee_code:   EmployeeCode.optional(),
  employment_date: EmploymentDate.optional(),
  role:            MembershipRole.optional(),
  updated_at:      UpdatedAt.optional()
}).meta({
  id: "MembershipUpdate",
  title: "Membership Update",
  description: "Schema for updating an existing organization membership.",
});


export const OrgInsertRequestSchema = z.object({
  organization: OrgInsertSchema,
  brands:       BrandInsertSchema.array(),
  founders:     FounderInsertSchema.array(),
  membership:   MembershipInsertSchema
}).meta({
  id: "OrgInsertRequest",
  title: "Organization Insert Request",
  description: "Request body for creating an organization along with its brands, founders, and the creator's membership.",
});

export const OrgUpdateRequestSchema = z.object({
  organization: OrgUpdateSchema.optional(),
  brands:       BrandUpdateSchema.array().optional(),
  founders:     FounderUpdateSchema.array().optional(),
}).meta({
  id: "OrgUpdateRequest",
  title: "Organization Update Request",
  description: "Request body for updating an organization along with its brands and founders.",
});


export const OrgQueryParamsSchema = z.object({
  withBranches: z.enum(['true', 'false']).optional().meta({
    description: "Whether to include branch data in the response",
    example: "true",
  }),
  defaultOrgOnly: z.enum(['true', 'false']).optional().meta({
    description: "Whether to only return the user's default organization",
    example: "false",
  }),
}).meta({
  id: "OrgQueryParams",
  title: "Organization Query Parameters",
  description: "Query parameters for filtering the organizations returned for the authenticated user.",
});

