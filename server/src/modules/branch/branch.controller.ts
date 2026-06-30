import { BrcParams } from "./branch.types";
import { TableName } from "../organization/organization.types";
import { canAccessUser } from "../base/base.services";
import { BranchServices } from "./branch.services";
import { InvalidCredentials } from "@/errors";
import { NextFunction, Request, Response } from "express";
import { TokenServices } from "../token/token.services";


export class BranchController {
  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  public static async create(
    req: Request,
    res: Response,
    next: NextFunction 
  ) {
    try {
      const { branch, brcmem } = req.body;
      const pscope = req.scopes;
  
      if (!canAccessUser(pscope)) return;
  
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
  public static async findMembers(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const id = req.params.id;
      const pscope = req.scopes;

      if (!canAccessUser(pscope)) return;

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

  public static async selectBranch(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

      const acsToken = await TokenServices.createAccessToken(
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
  public static update(
    req: Request,
    res: Response,
    next: NextFunction 
  ) {
    return BranchController.save(
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
  public static updateMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return BranchController.save(
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
  public static delete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return BranchController.deleteHandler(
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
  public static deleteMember(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    return BranchController.deleteHandler(
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
  private static async save(
    req: Request<any, any, BrcParams>,
    res: Response,
    next: NextFunction,
    action: 'create' | 'update',
    table: TableName = TableName.branch
  ) {
    try {
      const branch = req.body;
      const pscope = req.scopes;

      if (!canAccessUser(pscope)) return;

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
  private static async deleteHandler(
    req: Request,
    res: Response,
    next: NextFunction,
    record: 'brc' | 'brcmem'
  ) {
    try {
      const id = req.params.id;
      const pscope = req.scopes;

      if (!canAccessUser(pscope)) return;
      
      const col = record === 'brc'
        ? 'branch_id'
        : 'id';

      await BranchServices
        .delete(id, TableName.branchMem, col);

      if (record === 'brc') {
        await BranchServices
          .delete(id, TableName.branch);
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
}