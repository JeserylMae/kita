import * as z from 'zod';


export const SignupParamsSchema = z.object({
  email:    z.email(),
  password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/),
  url:      z.url()
});

export const ResetPasswordParamsSchema = z.object({
  email:       z.email(),
  token:       z.string(),
  newPassword: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
});

export const UserInsertSchema = z.object({
  auth_id: z.uuid(),

  firstname:  z.string().optional(),
  middlename: z.string().optional(),
  lastname:   z.string().optional(), 
  suffix:     z.string().optional(),

  house_number: z.string().optional(),
  street:       z.string().optional(),
  barangay:     z.string().optional(),
  city:         z.string().optional(),
  province:     z.string().optional(),
  region:       z.string().optional(),

  birthdate: z.iso.date().optional(),

  email:    z.email(),
  password: z.string(),

  verification_token: z.string(),
  token_expires_at:   z.iso.datetime()
});


export const UserUpdateSchema = z.object({
  firstname:  z.string().optional(),
  middlename: z.string().optional(),
  lastname:   z.string().optional(), 
  suffix:     z.string().optional(),

  house_number: z.string().optional(),
  street:       z.string().optional(),
  barangay:     z.string().optional(),
  city:         z.string().optional(),
  province:     z.string().optional(),
  region:       z.string().optional(),

  birthdate: z.iso.date().optional(),

  email:    z.email().optional(),
  password: z.string().optional(),

  default_org: z.uuid().optional(),

  verified_at:        z.iso.datetime().optional(),
  verification_token: z.string().optional(),
  token_expires_at:   z.iso.datetime().optional()
});