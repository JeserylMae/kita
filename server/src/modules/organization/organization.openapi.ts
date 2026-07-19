import type { ZodOpenApiPathItemObject } from 'zod-openapi';

import {
  MembershipUpdateSchema,
  OrgInsertRequestSchema,
  OrgUpdateRequestSchema,
  OrgQueryParamsSchema
} from "@/modules/organization/organization.schemas";
import { IdParamsSchema } from '../base/base.schemas';


export const GetOrganizationsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:          ["Organizations"],
    summary:       "Get user's organizations",
    description:   "Retrieves the organizations (and optionally branches) the authenticated user is a member of.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: OrgQueryParamsSchema },

    responses: {
      201: { description: "Organizations and branches retrieved successfully" },
      401: { description: "Unauthorized" },
    },
  },
};

export const GetMembersPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Organizations"],
    summary:     "Get organization members",
    description: "Retrieves all members belonging to the specified organization.",
    security:    [{ cookieAuth: [] }],

    responses: {
      200: { description: "Organization members retrieved successfully" }, 
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Organization not found" },
    },
  },
};

export const SwitchOrganizationPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Organizations"],
    summary:     "Switch active organization",
    description: "Switches the authenticated user's active organization context and issues a new access token.",
    security:    [{ cookieAuth: [] }],

    requestParams: { query: IdParamsSchema },

    responses: {
      200: { description: "Switched to selected organization" },
      401: { description: "Unauthorized" },
      404: { description: "Membership not found for this organization" },
    },
  },
};

export const CreateOrganizationPath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Organizations"],
    summary:     "Create organization",
    description: "Creates a new organization along with its brands, founders, and the creator's membership.",
    security:    [{ cookieAuth: [] }],

    requestBody: {
      required: true,
      content: { "application/json": { schema: OrgInsertRequestSchema } },
    },

    responses: {
      201: { description: "Organization created successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
    },
  },
};

export const UpdateOrganizationPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:        ["Organizations"],
    summary:     "Update organization",
    description: "Updates an existing organization's information, brands, and founders.",
    security:    [{ cookieAuth: [] }],

    requestBody: {
      required: true,
      content: { "application/json": { schema: OrgUpdateRequestSchema } },
    },

    responses: {
      201: { description: "Organization updated successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Organization not found" },
    },
  },
};

export const UpdateMemberPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:        ["Organizations"],
    summary:     "Update organization member",
    description: "Updates an existing member's status, role, or employment information within an organization.",
    security:    [{ cookieAuth: [] }],
    
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required: true,
      content: { "application/json": { schema: MembershipUpdateSchema } },
    },

    responses: {
      201: { description: "Member information updated successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Member not found" },
    },
  },
};

export const DeleteOrgPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:        ["Organizations"],
    summary:     "Delete organization",
    description: "Deletes the current organization context.",
    security:    [{ cookieAuth: [] }],
    
    responses: {
      200: { description: "Deletion successful" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
    },
  },
};

export const DeleteMemberPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Organizations"],
    summary:       "Delete organization member",
    description:   "Removes a member from an organization.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },
    
    responses: {
      200: { description: "Member deleted successfully" },
      401: { description: "Unauthorized" },
      404: { description: "Member not found" },
    },
  },
};

export const DeleteFounderPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Organizations"],
    summary:       "Delete founder",
    description:   "Removes a founder record from an organization.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      200: { description: "Record deleted successfully" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Founder not found" },
    },
  },
};

export const DeleteBrandPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Organizations"],
    summary:       "Delete brand",
    description:   "Removes a brand/sub-brand record from an organization.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },
    
    responses: {
      200: { description: "Record deleted successfully" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Brand not found" },
    },
  },
};