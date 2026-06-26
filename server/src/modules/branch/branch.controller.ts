import { NextFunction, Request, Response } from "express";
import { BrcParams } from "./branch.types";
import { BranchServices } from "./branch.services";
import { TableName } from "../organization/organization.types";
import { InvalidCredentials } from "@/errors";


export class BranchController {
  /**
   * 
   * @param req 
   * @param res 
   * @param next 
   * @returns 
   */
  public static create(
    req: Request,
    res: Response,
    next: NextFunction 
  ) {
    return BranchController.save(
      req, res, next, 'create'
    );
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