import { TableName } from "../organization/organization.types";
import { createAccessToken} from "../token/token.services";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";

import * as BranchServices from "./branch.services";
import { BranchUpdate, MemberUpdate } from "./branch.types";


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
    const orgID = req.org?.id!;
    const orgMemID = req.org?.orgmemID!;
    const { branch, roleID } = req.body;

    await BranchServices.storeBranch(
      orgID,
      orgMemID,
      roleID,
      branch
    );

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
    // Note: the passed id in the params are used for validation
    // whether req.branch.id === req.params.id
    const id = req.branch?.id!;

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
  req: Request<any, any, BranchUpdate>,
  res: Response,
  next: NextFunction 
) => {
  return save(req, res, next);
}

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const updateMember = (
  req: Request<any, any, MemberUpdate>,
  res: Response,
  next: NextFunction
) => {
  return save(req, res, next, TableName.branchMem);
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
  req: Request<any, any, BranchUpdate | MemberUpdate>,
  res: Response,
  next: NextFunction,
  table: TableName = TableName.branch
) => {
  try {
    const id = req.params.id;
    const record = req.body;

    await BranchServices
      .save(id, record, table);

    res.status(200).json({
      'success': true,
      'message': 'Record was successfully updated.'
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
