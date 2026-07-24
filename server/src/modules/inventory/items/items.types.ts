import * as z from 'zod';
import { 
  ItemInsertSchema, 
  ItemPaginationSchema, 
  ItemUpdateSchema 
} from './items.schemas';


export type ItemInsert = z.infer<typeof ItemInsertSchema>;

export type ItemUpdate = z.infer<typeof ItemUpdateSchema>;

export type ItemPagination = z.infer<typeof ItemPaginationSchema>;
