import { ZodOpenApiPathItemObject } from "zod-openapi";
import { IdParamsSchema } from "@/modules/base/base.schemas";

import { 
  ItemInsertSchema,
  ItemUpdateSchema
 } from "./items.schemas";


export const ItemInsertPath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Inventory Items"],
    summary:     "Create a new inventory item",
    description: "Creates a new inventory item in the system.",
    security:    [{ cookieAuth: [] }],

    requestBody: {
      required: true,
      content: { "application/json": { schema: ItemInsertSchema }},
    },

    responses: {
      "201": { description: "Inventory item created successfully" },
      "400": { description: "Invalid request body" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden" },
      "500": { description: "Internal server error" },
    },
  },
};

export const ItemUpdatePath: ZodOpenApiPathItemObject = {
  patch: {
    tags:        ["Inventory Items"],
    summary:     "Update an existing inventory item",
    description: "Updates an existing inventory item in the system.",
    security:    [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required: true,
      content: { "application/json": { schema: ItemUpdateSchema } },
    },

    responses: {
      "200": { description: "Inventory item updated successfully" },
      "400": { description: "Invalid request body" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden" },
      "404": { description: "Inventory item not found" },
      "500": { description: "Internal server error" },
    },
  },
};

export const GetItemsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Inventory Items"],
    summary:     "Retrieve all inventory items",
    description: "Retrieves all inventory items in the system.",
    security:    [{ cookieAuth: [] }],

    responses: {
      "200": { description: "Inventory items retrieved successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden" },
      "500": { description: "Internal server error" },
    },
  },
};

export const DeleteItemPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Inventory Items"],
    summary:       "Delete an inventory item",
    description:   "Deletes an existing inventory item from the system.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      "200": { description: "Inventory item deleted successfully" },
      "401": { description: "Unauthorized" },
      "403": { description: "Forbidden" },
      "404": { description: "Inventory item not found" },
      "500": { description: "Internal server error" },
    },
  },
};