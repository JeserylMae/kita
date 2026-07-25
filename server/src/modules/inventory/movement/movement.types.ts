import * as z from 'zod';
import { 
  MovementInsertSchema, 
  MovementPaginationSchema, 
  MovementUpdateSchema 
} from './movement.schemas';


export type MovementInsert = z.infer<typeof MovementInsertSchema>;

export type MovementUpdate = z.infer<typeof MovementUpdateSchema>;

export type MovementPagination = z.infer<typeof MovementPaginationSchema>;