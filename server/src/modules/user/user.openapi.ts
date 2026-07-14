import * as z from 'zod';
import { Email } from '../base/base.schemas';
import type { ZodOpenApiPathItemObject } from 'zod-openapi';

import { 
  ResetPasswordParamsSchema, 
  SigninParamsSchema, 
  SignupParamsSchema,
  UserUpdateSchema,
  ForgotPasswordParamsSchema
} from "@/modules/user/user.schemas";


export const SignupPath: ZodOpenApiPathItemObject  = {
  post: {
    tags: ["Auth"],
    summary: "Signup user",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: SignupParamsSchema,
        },
      },
    },

    responses: {
      201: {
        description: "User created successfully",
      },

      400: {
        description: "Invalid request",
      },
    },
  },
};

export const SigninPath = {
  post: {
    tags: ["Auth"],
    summary: "Sign in user",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: SigninParamsSchema,
        },
      }
    },

    responses: {
      200: {
        description: "Signin successful",
      },

      401: {
        description: "Invalid credentials",
      },
    },
  },
};

export const LogoutPath: ZodOpenApiPathItemObject = {
  delete: {
    tags: ["Auth"],
    summary: "Logout user account.",
    description: "Delete access token from cookie.",

    security: [
      {
        cookieAuth: [],
      },
    ],

    responses: {
      200: {
        description: "Logout successfully",
      },

      400: {
        description: "Invalid reset token or request data",
      },
    },
  },
};

export const ResetPasswordPath: ZodOpenApiPathItemObject  = {
  post: {
    tags: ["Auth"],
    summary: "Reset user password",
    description: "Resets a user's password using a valid reset token.",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: ResetPasswordParamsSchema,
        },
      },
    },

    responses: {
      200: {
        description: "Password reset successfully",
      },

      400: {
        description: "Invalid reset token or request data",
      },

      404: {
        description: "User not found",
      },
    },
  },
};

export const ForgotPasswordPath: ZodOpenApiPathItemObject = {
  post: {
    tags: ["Auth"],
    summary: "Request forgot password",
    description: "Sends a password reset email if an account exists for the given email.",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: ForgotPasswordParamsSchema,
        },
      },
    },

    responses: {
      202: {
        description: "Email sent",
      },

      400: {
        description: "Invalid request",
      },
    },
  },
};

export const VerifyEmailPath: ZodOpenApiPathItemObject = {
  get: {
    tags: ["Auth"],
    summary: "Verify user email",
    description: "Verifies a user's email address using a token sent via email.",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: z.object({
            email: Email,
          }),
        },
      },
    },

    parameters: [
      {
        name: "token",
        in: "query",
        required: true,
        description: "Email verification token",
        schema: {
          type: "string",
        },
      },
    ],

    responses: {
      200: {
        description: "Verification email sent if an unverified account exists",
      },

      400: {
        description: "Invalid or missing token",
      },
    },
  },
};

export const ResendEmailVerificationPath: ZodOpenApiPathItemObject = {
  post: {
    tags: ["Auth"],
    summary: "Resend email verification",
    description: "Resends the verification email if an unverified account exists for the given email.",

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: ForgotPasswordParamsSchema,
        },
      },
    },

    responses: {
      200: {
        description: "New verification email sent if an unverified account exists",
      },

      400: {
        description: "Invalid request",
      },
    },
  },
};

export const MePath: ZodOpenApiPathItemObject = {
  get: {
    tags: ["Users"],
    summary: "Get current user",
    description: "Retrieves the authenticated user's information.",

    security: [
      {
        cookieAuth: [],
      },
    ],

    responses: {
      200: {
        description: "User information retrieved successfully",
      },

      401: {
        description: "Unauthorized",
      },

      403: {
        description: "Insufficient permissions",
      },
    },
  },
};

export const UserUpdatePath: ZodOpenApiPathItemObject = {
  patch: {
    tags: ["Users"],
    summary: "Update user",
    description: "Updates an existing user's information.",

    security: [
      {
        cookieAuth: [],
      },
    ],

    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
        description: "User UUID",
        schema: {
          type: "string",
          format: "uuid",
        },
        example: "550e8400-e29b-41d4-a716-446655440000",
      },
    ],

    requestBody: {
      required: true,
      content: {
        "application/json": {
          schema: UserUpdateSchema,
        },
      },
    },

    responses: {
      200: {
        description: "User updated successfully",
      },

      400: {
        description: "Invalid request data",
      },

      401: {
        description: "Unauthorized",
      },

      403: {
        description: "Insufficient permissions",
      },

      404: {
        description: "User not found",
      },
    },
  },
};