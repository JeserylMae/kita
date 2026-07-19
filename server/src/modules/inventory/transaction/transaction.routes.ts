import { Router } from "express";
import { validateBody } from "@/middleware/validation.middleware";
import { invtMiddlewares } from "../common/inventory.middlewares";
import { QueryParamsSchema } from "./transaction.schemas";
import { findAll, findDetails } from "./transaction.controller";

import { 
  requireAuth, 
  requireBrc, 
  requireOrg
} from "@/middleware/auth.middleware";


const txnRouter = Router();

txnRouter.use(requireAuth);
txnRouter.use(requireOrg);
txnRouter.use(requireBrc);

txnRouter.get('/',
  ...invtMiddlewares('select.txn'),
  findAll
);

txnRouter.get('/details',
  ...invtMiddlewares('select.txn'),
  validateBody(QueryParamsSchema),
  findDetails
);

export default txnRouter;