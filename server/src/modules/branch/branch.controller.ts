import { BrcParams } from "./branch.types";
import { TableName } from "../organization/organization.types";
import { createAccessToken} from "../token/token.services";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";

import * as BranchServices from "./branch.services";


/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const create = async (
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  try {
    const { branch, brcmem } = req.body;

    await BranchServices.storeBranch(branch, brcmem);

    res.status(201).json({
      'success': true,
      'message': 'Branch was created.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
export const findMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    if (typeof id !== 'string') {
      throw new InvalidCredentials(
        'ID must be a string.'
      );
    }

    const data = await BranchServices.findMembers(id);

    res.status(200).json({
      'success': true,
      'message': 'Branch members was retrieved.',
      'brcMembers': data 
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const selectBranch = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchID = req.params.id;
    const org = req.org;
    const user = req.user;

    if (typeof branchID !== 'string') {
      throw new InvalidCredentials(
        'Invalid branch ID.'
      );
    }

    const brc = await BranchServices.findRole(org?.orgmemID!, branchID);

    const acsToken = await createAccessToken(
      { id: user?.id! }, 
      user?.sid!,
      org?.id!,
      org?.role!,
      org?.orgmemID!,
      branchID,
      brc?.role
    );

    res.cookie('ACCESS-TOKEN', acsToken, {
      httpOnly: true,
      secure: true, 
      sameSite: 'strict'
    })
    .status(200)
    .json({
      'success': true,
      'message': 'Branch selected',
    });
  } 
  catch (error: unknown) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const update = (
  req: Request,
  res: Response,
  next: NextFunction 
) => {
  return save(
    req, res, next, 'update'
  );
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const updateMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return save(
    req, res, next, 'update', TableName.branchMem
  );
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteBranch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return deleteHandler(
    req, res, next, 'brc'
  );
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const deleteMember = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return deleteHandler(
    req, res, next, 'brcmem'
  );
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @param action 
 */
const save = async (
  req: Request<any, any, BrcParams>,
  res: Response,
  next: NextFunction,
  action: 'create' | 'update',
  table: TableName = TableName.branch
) => {
  try {
    const branch = req.body;

    await BranchServices.save(
      branch, 
      table
    );

    let message = action === 'create'
      ? 'Branch was successfully created.'
      : 'Branch was successfully updated.';

    res.status(201).json({
      'success': true,
      'message': message
    });
  }
  catch (error:unknown) {
    next(error);
  }
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 */
const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
  record: 'brc' | 'brcmem'
) => {
  try {
    const id = req.params.id;
    
    const col = record === 'brc'
      ? 'branch_id'
      : 'id';

    await BranchServices
      .deleteHandler(id, TableName.branchMem, col);

    if (record === 'brc') {
      await BranchServices
        .deleteHandler(id, TableName.branch);
    }

    res.status(200).json({
      'success': true,
      'message': 'Record was deleted.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}
