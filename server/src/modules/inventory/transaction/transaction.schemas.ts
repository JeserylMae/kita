import * as z from 'zod';


export const TransactionInsertSchema = z.object({
  branch_id:       z.uuid(),
  amount:          z.number(),
  payment_method:  z.string(),
  reference_type:  z.string(),
  reference_id:    z.uuid(),
  code:            z.string(),
  created_by_name: z.string().optional(),
  created_by_role: z.string().optional()
});

export const TransactionUpdateSchema = z.object({
  amount:          z.number().optional(),
  payment_method:  z.string().optional(),
  reference_type:  z.string().optional(),
  reference_id:    z.uuid().optional(),
  code:            z.string().optional(),
  created_by_name: z.string().optional(),
  created_by_role: z.string().optional()
});