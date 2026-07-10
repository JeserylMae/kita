import * as z from 'zod';
import { 
  ItemInsertSchema, 
  ItemUpdateSchema 
} from './items.schemas';


export type ItemInsert = z.infer<typeof ItemInsertSchema>;

export type ItemUpdate = z.infer<typeof ItemUpdateSchema>;