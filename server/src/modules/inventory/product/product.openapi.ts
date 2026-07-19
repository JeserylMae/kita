import { ZodOpenApiPathItemObject } from "zod-openapi";
import { ProductInsertRequestSchema, ProductUpdateSchema, VariantUpdateSchema } from "./product.schemas";
import { IdParamsSchema } from "@/modules/base/base.schemas";


export const GetAllProductsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Products"],
    summary:     "Get all products",
    description: "Retrieves all products in the inventory.",
    security:    [{ cookieAuth: [] }],

    responses: {
      200: { description: "Products retrieved successfully" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
    },
  },
};

export const CreateProductPath: ZodOpenApiPathItemObject = {
  post: {
    tags:        ["Products"],
    summary:     "Create a new product",
    description: "Creates a new product in the inventory.",
    security:    [{ cookieAuth: [] }],

    requestBody: {
      required:    true,
      description: "Product data to be created",
      content:     { "application/json": { schema: ProductInsertRequestSchema } },
    },  
    
    responses: {
      201: { description: "Product created successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
    },
  },
};

export const UpdateProductPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:          ["Products"],
    summary:       "Update a product",
    description:   "Updates an existing product in the inventory.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required:    true,
      description: "Product data to be updated",
      content:     { "application/json": { schema: ProductUpdateSchema } },
    },

    responses: {
      200: { description: "Product updated successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Product not found" },
    },
  },
};

export const UpdateProductVariantPath: ZodOpenApiPathItemObject = {
  patch: {
    tags:          ["Products"],
    summary:       "Update a product variant",
    description:   "Updates an existing product variant in the inventory.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    requestBody: {
      required:    true,
      description: "Product variant data to be updated",
      content:     { "application/json": { schema: VariantUpdateSchema } },
    },

    responses: {
      200: { description: "Product variant updated successfully" },
      400: { description: "Invalid request data" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Product variant not found" },
    },
  },
};

export const DeleteProductPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Products"],
    summary:       "Delete a product",
    description:   "Deletes an existing product from the inventory.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      200: { description: "Product deleted successfully" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Product not found" },
    },
  },
};

export const DeleteProductVariantPath: ZodOpenApiPathItemObject = {
  delete: {
    tags:          ["Products"],  
    summary:       "Delete a product variant",
    description:   "Deletes an existing product variant from the inventory.",
    security:      [{ cookieAuth: [] }],
    requestParams: { query: IdParamsSchema },

    responses: {
      200: { description: "Product variant deleted successfully" },
      401: { description: "Unauthorized" },
      403: { description: "Insufficient permissions" },
      404: { description: "Product variant not found" },
    },
  },
};