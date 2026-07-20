import * as z from 'zod';

import {
  BranchID,
  RoleID,
  Icon,
  HexColor,
} from '@/modules/base/base.schemas';


const OrgMemID = z.uuid().meta({
  description: "Organization member UUID",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

const MemberStatus = z.enum(['invited', 'accepted', 'rejected', 'expired', 're-invited', 'removed']).meta({
  description: "Status of the branch member",
  example: "active",
});

const Starred = z.boolean().meta({
  description: "Indicates if the branch member is starred",
  example: true,
});

const BranchName = z.string().meta({
  description: "Name of the branch",
  example: "Main Branch",
});

const Address = z.string().meta({
  description: "Address of the branch",
  example: "123 Main St, City, Country",
});

const BranchStatus = z.enum(['active', 'inactive', 'closed', 'under review', 'suspended']).meta({
  description: "Status of the branch",
  example: "active",
});

export const MemberInsertSchema = z.object({
  branch_id:  BranchID,
  org_mem_id: OrgMemID,
  role_id:    RoleID,
  status:     MemberStatus
});

export const MemberUpdateSchema = z.object({
  role_id: RoleID.optional().nullable(),
  status:  MemberStatus.optional().nullable(),
  starred: Starred.optional().nullable()
});

export const BranchInsertSchema = z.object({
  branch_name: BranchName,
  icon:        Icon.optional().nullable(),
  color:       HexColor.optional().nullable(),
  address:     Address.optional().nullable()
});

export const BranchUpdateSchema = z.object({
  branch_name: BranchName.optional().nullable(),
  icon:        Icon.optional().nullable(),
  color:       HexColor.optional().nullable(),
  address:     Address.optional().nullable(),
  status:      BranchStatus.optional().nullable()
});

export const BranchInsertRequestParamsSchema = z.object({
  branch: BranchInsertSchema,
  roleID: RoleID
}).meta({
  description: "Branch insert parameter list."
});