import { ZodOpenApiPathItemObject } from 'zod-openapi';

import { 
  MovementInsertSchema, 
  MovementUpdateSchema 
} from './movement.schemas';
import { IdParamsSchema } from '@/modules/base/base.schemas';


export const GetMovementPath: ZodOpenApiPathItemObject = {
  get: {
    summary:     "Get all inventory movements",
    description: "Retrieve a list of all inventory movements in the system.",
    tags:        ["Inventory Movements"],
    security:    [{ cookieAuth: [] }],

    responses: {
      "200": { description: "A list of inventory movements" },
      "401": { description: "Unauthorized - Authentication required" },
      "403": { description: "Forbidden - Insufficient permissions" },
      "500": { description: "Internal Server Error" },
    },
  },
};

export const PostMovementPath: ZodOpenApiPathItemObject = {
  post: {
    summary:     "Create a new inventory movement",
    description: "Create a new inventory movement in the system.",
    tags:        ["Inventory Movements"],
    security:    [{ cookieAuth: [] }],

    requestBody: {
      required:    true,
      content: { "application/json": { schema: MovementInsertSchema }},
    },

    responses: {
      "201": { description: "Inventory movement created successfully" },
      "400": { description: "Bad Request - Invalid input data" },
      "401": { description: "Unauthorized - Authentication required" },
      "403": { description: "Forbidden - Insufficient permissions" },
      "500": { description: "Internal Server Error" },
    },
  },
};

export const PatchMovementPath: ZodOpenApiPathItemObject = {
  patch: {
    summary:       "Update an existing inventory movement",
    description:   "Update an existing inventory movement in the system.",
    tags:          ["Inventory Movements"],
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required:    true,
      content: { "application/json": { schema: MovementUpdateSchema }},
    },

    responses: {
      "200": { description: "Inventory movement updated successfully" },
      "400": { description: "Bad Request - Invalid input data" },
      "401": { description: "Unauthorized - Authentication required" },
      "403": { description: "Forbidden - Insufficient permissions" },
      "404": { description: "Not Found - Inventory movement not found" },
      "500": { description: "Internal Server Error" },
    },
  },
};

export const DeleteMovementPath: ZodOpenApiPathItemObject = {
  delete: {
    summary:       "Delete an existing inventory movement",
    description:   "Delete an existing inventory movement from the system.",
    tags:          ["Inventory Movements"],
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Inventory movement deleted successfully" },
      "401": { description: "Unauthorized - Authentication required" },
      "403": { description: "Forbidden - Insufficient permissions" },
      "404": { description: "Not Found - Inventory movement not found" },
      "500": { description: "Internal Server Error" },
    },
  },
};
