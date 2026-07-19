import { ZodOpenApiPathItemObject } from 'zod-openapi';
import { QueryParamsSchema } from './transaction.schemas';


export const FindAllTransactionsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Inventory Transactions"],
    summary:     "Get all transactions",
    description: "Retrieves all inventory transactions for the authenticated user's organization and branch.",
    security:    [{ cookieAuth: [] }],

    responses: {
      200: { description: "Transactions retrieved successfully" },
      401: { description: "Unauthorized" },
    },
  },
};

export const FindTransactionDetailsPath: ZodOpenApiPathItemObject = {
  get: {
    tags:        ["Inventory Transactions"],
    summary:     "Get transaction details",
    description: "Retrieves detailed information for a specific inventory transaction based on its ID and reference type.",
    security:    [{ cookieAuth: [] }],
    
    requestParams: { query: QueryParamsSchema },

    responses: {
      200: { description: "Transaction details retrieved successfully" },
      400: { description: "Invalid request parameters" }, 
      401: { description: "Unauthorized" },
      404: { description: "Transaction not found" },
    },
  },
};