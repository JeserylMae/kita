import * as z from 'zod';
import { UserInsertSchema, UserUpdateSchema } from './user.schemas';


export type PermissionInfo = {
  role:  string;
  scope: string;
};

export interface verifyEmail {
  email:     string;
  acceptURL: string;
}

export interface UserSelect {
  id?: string;
  auth_id?: string;
  
  firstname?:   string;
  middlename?:  string;
  lastname?:    string;
  suffix?:      string;

  house_number?: string;
  street?:       string;
  barangay?:     string;
  city?:         string;
  province?:     string;
  region?:       string;

  birthdate?: Date;

  email?:    string;
  password?: string;

  default_org?: string;

  updated_at?:         Date;
  verified_at?:        Date;
  verification_token?: string;
  token_expires_at?:   Date;
}


export type UserInsert = z.infer<typeof UserInsertSchema>;

export type UserUpdate = z.infer<typeof UserUpdateSchema>;