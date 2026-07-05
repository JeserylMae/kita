import { NextFunction, Request, Response } from "express";
import { 
  findAll as findAllTxn, 
  findDetails as findTxnDetails 
} from "./transaction.services";


export const findAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchID = req.branch?.id!;

    const data = await findAllTxn(branchID);

    res.status(200).json({
      'success': true,
      'message': 'Transactions was retrieved.',
      'transactions': data
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const findDetails = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id!;
    const referenceType = req.query.referenceType!;

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