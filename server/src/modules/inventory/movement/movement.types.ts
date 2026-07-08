import * as z from 'zod';
import { 
  MovementInsertSchema, 
  MovementUpdateSchema 
} from './movement.schemas';


export type MovementInsert = z.infer<typeof MovementInsertSchema>;

export type MovementUpdate = z.infer<typeof MovementUpdateSchema>;