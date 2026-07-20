import * as z from 'zod';
import { 
  ForgotPasswordParamsSchema, 
  ResetPasswordParamsSchema, 
  SigninParamsSchema, 
  SignupParamsSchema, 
  UserInsertSchema, 
  UserUpdateSchema 
} from './user.schemas';


export type PermissionInfo = {
  role:  string;
  scope: string;
};

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

export type SignupParams         = z.infer<typeof SignupParamsSchema>;

export type SigninParams         = z.infer<typeof SigninParamsSchema>;

export type ForgotPasswordParams = z.infer<typeof ForgotPasswordParamsSchema>;

export type ResetPasswordParams  = z.infer<typeof ResetPasswordParamsSchema>;

export type UserInsert           = z.infer<typeof UserInsertSchema>;

export type UserUpdate           = z.infer<typeof UserUpdateSchema>;