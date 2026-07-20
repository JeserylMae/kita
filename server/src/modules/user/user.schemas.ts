import * as z from 'zod';
import {
  AuthID,
  OrgID,
  Email,
  Token,
  ExpiresAt,
  VerifiedAt,
  URL
} from '@/modules/base/base.schemas';


const Password = z.string().regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/).meta({
  id: "Password",
  description: "Password containing at least 8 characters, including one letter and one number",
  example: "Password123",
});

const FirstName = z.string().meta({
  description: "User's first name",
  example: "John",
});

const MiddleName = z.string().meta({
  description: "User's middle name",
  example: "Michael",
});

const LastName = z.string().meta({
  description: "User's last name",
  example: "Doe",
});

const Suffix = z.string().meta({
  description: "Name suffix",
  example: "Jr.",
});

const HouseNumber = z.string().meta({
  description: "House or unit number",
  example: "123",
});

const Street = z.string().meta({
  description: "Street name",
  example: "Rizal Street",
});

const Barangay =  z.string().meta({
  description: "Barangay",
  example: "Poblacion",
});

const City = z.string().meta({
  description: "City or municipality",
  example: "Batangas City",
});

const Province = z.string().meta({
  description: "Province",
  example: "Batangas",
});

const Region = z.string().meta({
  description: "Region",
  example: "Region IV-A",
});

const BirthDate = z.iso.date().meta({
  description: "Birth date",
  example: "2003-01-15",
});

export const SignupParamsSchema = z.object({
  email: Email,
  password: Password,
  url: URL,
}).meta({
  id: "SignupParams",
  title: "Signup Parameters",
  description: "Request body for user signup.",
});

export const SigninParamsSchema = z.object({
  email: Email,
  password: Password
}).meta({
  id: "SigninParams",
  title: "Signin Parameters",
  description: "Request body for user signin.",
});

export const ForgotPasswordParamsSchema = z.object({
  email:  Email,
  url:    URL,
}).meta({
  id: "ForgotPasswordParams",
  title: "Request Forgot Password Parameters",
  description: "Send forgot password email.",
});

export const ResetPasswordParamsSchema = z.object({
  email:       Email,
  newPassword: Password,
  token: Token,
}).meta({
  id: "ResetPasswordParams",
  title: "Reset Password Parameters",
  description: "Request body for resetting a user's password.",
});


export const UserInsertSchema = z.object({
  auth_id: AuthID,

  firstname:  FirstName.optional(),
  middlename: MiddleName.optional(),
  lastname:   LastName.optional(),
  suffix:     Suffix.optional(),

  house_number: HouseNumber.optional(),
  street:       Street.optional(),
  barangay:     Barangay.optional(),
  city:         City.optional(),
  province:     Province.optional(),
  region:       Region.optional(),

  birthdate:    BirthDate.optional(),

  email:        Email,
  password:     Password,

  verification_token: Token,
  token_expires_at:   ExpiresAt
}).meta({
  id: "UserInsert",
  title: "User Insert",
  description: "Schema for creating a new user.",
});

export const UserUpdateSchema = z.object({
  firstname:  FirstName.optional(),
  middlename: MiddleName.optional(),
  lastname:   LastName.optional(),
  suffix:     Suffix.optional(),

  house_number: HouseNumber.optional(),
  street:       Street.optional(),
  barangay:     Barangay.optional(),
  city:         City.optional(),
  province:     Province.optional(),
  region:       Region.optional(),

  birthdate: BirthDate.optional(),

  email:    Email.optional(),
  password: Password.optional(),
  
  verification_token: Token.optional(),
  token_expires_at:   ExpiresAt.optional(),
  verified_at:        VerifiedAt.optional(),

  default_org: OrgID.optional()
}).meta({
  id: "UserUpdate",
  title: "User Update",
  description: "Schema for updating an existing user.",
});
