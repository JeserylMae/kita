import { ItemInsert, ItemUpdate } from "./items.types";
import { ItemsServices } from "./items.services";
import { canAccessUser } from "../base/base.services";
import { NextFunction, Request, Response } from "express";
import { InvalidCredentials } from "@/errors";


export class ItemsController {
  public static async create(
    req: Request<any, any, ItemInsert>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pscope = req.scopes;
      const item = req.body;

      if (!canAccessUser(pscope)) return;

      if (!item.created_by) {
        item.created_by = req.user?.id!;
      }

      await ItemsServices.store(item);

      res.status(201).json({
        'success': true,
        'message': 'New inventory item was created.'
      });
    }
    catch(error: unknown) {
      next(error);
    }
  }

  public static async get(
    req: Request<any, any, ItemInsert>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pscope = req.scopes;
      const branchID = req.branch?.id!;
      const orgID = req.org?.id!;

      if (!canAccessUser(pscope)) return;

      if (typeof branchID === null
        || typeof orgID === null
      ) {
        throw new InvalidCredentials(
          'Invalid access token.'
        );
      }

      const items = await ItemsServices.getAllItems(branchID, orgID);

      res.status(200).json({
        'success': true,
        'message': 'Inventory items was retrieved.',
        'items': items
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }

  public static async update(
    req: Request<any, any, ItemUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pscope = req.scopes;
      const item = req.body;

      if (!canAccessUser(pscope)) return;

      await ItemsServices.update(item);

      res.status(201).json({
        'success': true,
        'message': 'Inventory item was updated.'
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }

  public static async delete(
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
          'Invalid inventory item ID.'
        );
      }

      await ItemsServices.delete(id);

      res.status(200).json({
        'success': true,
        'message': 'Inventory item was deleted.'
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }
}