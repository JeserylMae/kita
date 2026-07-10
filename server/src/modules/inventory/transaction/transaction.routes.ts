import { Router } from "express";
import { validateBody } from "@/middleware/validation.middleware";
import { QueryParamsSchema } from "./transaction.schemas";
import { findAll, findDetails } from "./transaction.controller";

import { 
  requireAuth, 
  requireBrc, 
  requireOrg, 
  verifyBrcPermission 
} from "@/middleware/auth.middleware";


const txnRouter = Router();

txnRouter.get('/',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.txn'),
  findAll
);

txnRouter.get('/details',
  requireAuth,
  requireOrg,
  requireBrc,
  verifyBrcPermission('select.txn'),
  validateBody(QueryParamsSchema),
  findDetails
);

export default txnRouter;