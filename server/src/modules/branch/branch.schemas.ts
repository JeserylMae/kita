import * as z from 'zod';


export const MemberInsertSchema = z.object({
  branch_id:  z.uuid(),
  org_mem_id: z.uuid(),
  role_id:    z.uuid(),
  status:     z.string()
});

export const MemberUpdateSchema = z.object({
  role_id: z.uuid().optional(),
  status:  z.string().optional(),
  starred: z.boolean().optional()
});

export const BranchInsertSchema = z.object({
  branch_name: z.string(),
  icon:        z.string().optional(),
  color:       z.string().optional(),
  address:     z.string().optional()
});

export const BranchUpdateSchema = z.object({
  branch_name: z.string(),
  icon:        z.string().optional(),
  color:       z.string().optional(),
  address:     z.string().optional(),
  status:      z.string().optional()
});
