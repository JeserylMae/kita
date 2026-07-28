import { assertBrc } from "@/modules/base/base.services";
import { QueryParams } from "./transaction.types";

import { 
  NextFunction, 
  Request, 
  Response 
} from "express";

import { 
  findAll as findAllTxn, 
  findDetails as findTxnDetails 
} from "./transaction.services";
import { TransactionPaginationSchema } from "./transaction.schemas";


export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const branchID = req.context.brc.id;
    const options = TransactionPaginationSchema.parse(req.query);

    const { data, hasNextPage, nextCursor } = await findAllTxn(branchID, options);

    res.status(200).json({
      'success': true,
      'message': 'Transactions was retrieved.',
      'transactions': data,
      'pagination': {
        'pageSize': options.pageSize,
        'nextCursor': nextCursor,
        'hasNextPage': hasNextPage,
      }
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const findDetails = async (
  req: Request<any, any, any, QueryParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);
    
    const id = req.query.id;
    const referenceType = req.query.referenceType;

    const data = await findTxnDetails(id, referenceType);

    res.status(200).json({
      'success': true,
      'message': 'Transaction details was retrieved.',
      'details': data
    });
  }
  catch (error: unknown) {
    next(error);
  }
}