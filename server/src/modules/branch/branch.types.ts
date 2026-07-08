import * as z from 'zod';
import { 
  BranchInsertSchema, 
  BranchUpdateSchema, 
  MemberInsertSchema, 
  MemberUpdateSchema 
} from './branch.schemas';


export type MemberInsert = z.infer<typeof MemberInsertSchema>;

export type MemberUpdate = z.infer<typeof MemberUpdateSchema>;

export type BranchInsert = z.infer<typeof BranchInsertSchema>; 

export type BranchUpdate = z.infer<typeof BranchUpdateSchema>;
