import * as z from 'zod';


const PageSize =  z.number().min(1).max(100).default(10).meta({
  id: "Page Size",
  description: "Default: 10. Limits the number of returned data, used with pagination.",
  example: 10,
});

const Cursor = z.uuid().meta({
  id: 'Cursor',
  description: "The last ID of the last record in the paginated record.",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const PaginationSchema =  z.object({
    pageSize: PageSize,
    cursor: Cursor.optional(),
    order: z.enum(['asc', 'desc']).default('asc')
  }).meta({ description: 'Modifies how GET request data filters its records.'});

export const UUID = z.uuid().meta({
  id: "UUID",
  description: "Universal UUID.",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const AuthID = z.uuid().meta({
  id: "AuthID",
  description: "Authentication UUID.",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const OrgID = z.uuid().meta({
  description: "Organization UUID",
  example: "550e8400-e29b-41d4-a716-446655440000",
});

export const BranchID = z.uuid().meta({
  description: "Branch UUID",
  example: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
});

export const RoleID = z.uuid().meta({
  description: "Role UUID",
  example: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
});

export const Email = z.email().meta({
  id: "email",
  description: "User's email address",
  example: "john.doe@example.com",
});

export const Token =  z.string().meta({
  description: "Universal verification token",
  example: "b4f5c2d8e9a14f2f9c3a8b7d6e5f4a1c",
});

export const ExpiresAt = z.iso.datetime().meta({
  description: "Expiration date and time",
  example: "2026-07-15T12:00:00Z",
});

export const VerifiedAt = z.iso.datetime().meta({
  description: "Account verification date and time",
  example: "2026-07-15T12:00:00Z",
});

export const UpdatedAt = z.iso.datetime().meta({
  description: "Update verification date and time",
  example: "2026-07-15T12:00:00Z",
});

export const URL = z.url().meta({
  description: "Frontend callback URL after signup",
  example: "https://app.example.com/auth/verify",
});

export const CreatedByName = z.string().meta({
  description: "Name of the user who created the record",
  example: "John Doe",
});

export const CreatedByRole = z.string().meta({
  description: "Role of the user who created the record",
  example: "admin",
});

export const IdParamsSchema = z.object({
  id: UUID
});

export const Icon = z.string().meta({
  description: "Icon from Google Material Icons",
  example: "home",
});

export const HexColor = z.string().regex(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/).meta({
  description: "Brand color in hex format",
  example: "#1A73E8",
});

