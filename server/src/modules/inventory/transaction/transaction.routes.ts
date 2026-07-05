import { verifyPermission, verifyToken } from "@/middleware/auth.middleware";
import { Router } from "express";
import { findAll, findDetails } from "./transaction.controller";


const txnRouter = Router();

txnRouter.get('/',
  verifyToken,
  verifyPermission('select.txn'),
  findAll
);

txnRouter.get('/details',
  verifyToken,
  verifyPermission('select.txn'),
  findDetails
);

export default txnRouter;