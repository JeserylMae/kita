import type { ZodOpenApiPathItemObject } from "zod-openapi";
import { InvitationParamsSchema, InvitationResponseSchema } from "../organization/organization.schemas";
import { IdParamsSchema } from "../base/base.schemas";


export const InvitePath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Invitations"],
    summary:     "Send organization membership.",
    description: "Sends an invite email to the member.",
    security:    [{ cookieAuth: [] }],
    
    requestBody: {
      required: true,
      content: { "application/json": { schema: InvitationParamsSchema }}
    },

    responses: {
      201: { description: "Invitation was sent successfully." },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
    },
  },
};

export const RespondToInvitationPath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Invitation"],
    summary:     "Set invitation status to accepted, rejected, or expired.",
    description: "Updates invitation status.",

    parameters: [
      {
        name:        "token",
        in:          "path",
        required:    true,
        description: "Invitation token.",
        schema:      { type: "string" },
        example:     "b4f5c2d8e9a14f2f9c3a8b7d6e5f4a1c",
      }
    ],

    requestBody: {
      required: true,
      content: { "application/json": { schema: InvitationResponseSchema }}
    },

    responses: {
      201: { description: "Invitation status was successfully updated." },
      400: { description: "Invalid request data" },
    },
  },
};

export const ReinvitePath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Invitation"],
    summary:     "Re-send invitation email.",
    description: "Re-sends an invite email to the member.",

    parameters: [
      {
        name:        "id",
        in:          "path",
        required:    true,
        description: "Invitation ID.",
        schema:      { type: "string", format: "uuid" },
        example:     "550e8400-e29b-41d4-a716-446655440000",
      }
    ],

    responses: {
      201: { description: "Invitation was re-sent successfully." },
      400: { description: "Invalid request data" },
    },
  }
};


export const GetInvitationsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Invitation"],
    summary:     "Get all invitations for the authenticated user.",
    description: "Retrieves a list of invitations for the authenticated user.",

    parameters: [
      {
        name:        "id",
        in:          "path",
        required:    true,
        description: "Invitation ID.",
        schema:      { type: "string", format: "uuid" },
        example:     "550e8400-e29b-41d4-a716-446655440000",
      }
    ],

    responses: {
      200: { description: "List of invitations retrieved successfully." },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
    },
  }
};

export const DeleteInvitationPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:        ["Invitation"],
    summary:     "Delete an invitation.",
    description: "Deletes an invitation by its ID.",
    
    parameters: [
      {
        name:        "id", 
        in:          "path",
        required:    true,
        description: "Invitation ID.",
        schema:      { type: "string", format: "uuid" },
        example:     "550e8400-e29b-41d4-a716-446655440000",
      }
    ],

    responses: {
      200: { description: "Invitation deleted successfully." },
      400: { description: "Invalid request data" }, 
      401: { description: "Unauthorized" },
      404: { description: "Invitation not found" },
    },
  }
};