import { ZodOpenApiPathItemObject } from "zod-openapi";
import { BranchInsertRequestParamsSchema, BranchUpdateSchema, MemberUpdateSchema } from "./branch.schemas";
import { IdParamsSchema } from "../base/base.schemas";


export const CreateBranchPath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Branch"],
    summary:     "Create a new branch",
    description: "Creates a new branch in the organization.",
    security:     [{ cookieAuth: [] }],

    requestBody: {
      required: true,
      content: { "application/json": { schema: BranchInsertRequestParamsSchema }}
    },

    responses: {
      "201": { description: "Branch created successfully" },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};

export const FindMembersPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Branch"],
    summary:     "Select all members",
    description: "Select all members of the branch.",
    security:    [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Branch members was successfully retrieved." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};

export const SelectBranchPath: ZodOpenApiPathItemObject = {
  get: {
    tags:          ["Branch"],
    summary:       "Switch branch",
    description:   "Open another branch.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Branch switched successfully." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};

export const UpdateBranchPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:          ["Branch"],
    summary:       "Update branch info.",
    description:   "Modify some details about the branch",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required: true,
      content: { "application/json": { schema: BranchUpdateSchema }}
    },

    responses: {
      "201": { description: "Branch updated successfully." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};

export const UpdateMemberPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:          ["Branch"],
    summary:       "Update branch member info.",
    description:   "Modify some details about the member",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required: true,
      content: { "application/json": { schema: MemberUpdateSchema }}
    },

    responses: {
      "201": { description: "Branch Member updated successfully." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};

export const DeleteBranchPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Branch"],
    summary:       "Delete branch.",
    description:   "Delete all information of branch.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Branch deleted successfully." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};


export const DeleteMemberPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Branch"],
    summary:       "Delete branch member.",
    description:   "Delete all information of a branch member.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Branch member deleted successfully." },
      "400": { description: "Invalid request payload" },
      "401": { description: "Unauthorized access" },
      "403": { description: "Forbidden access" },
      "500": { description: "Internal server error" },
    }
  }
};