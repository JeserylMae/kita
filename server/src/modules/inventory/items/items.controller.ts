import { ItemsServices } from "./items.services";
import { InvalidCredentials } from "@/errors";
import { ItemInsert, ItemUpdate } from "./items.types";
import { NextFunction, Request, Response } from "express";


export class ItemsController {
  public static async create(
    req: Request<any, any, ItemInsert>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const item = req.body;
      const userID = req.user?.id!;

      await ItemsServices.store(item, userID);

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
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgID = req.org?.id!;
      const branchID = req.branch?.id!;

      if (typeof branchID === null
        || typeof orgID === null
      ) {
        throw new InvalidCredentials(
          'Invalid access token.'
        );
      }

      const items = await ItemsServices
        .getAllItems(branchID, orgID);

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
      const item = req.body;
      const itemID = req.params.id!;
      const branchID = req.branch?.id!;

      await ItemsServices.update(itemID, branchID, item);

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
      const id = req.params.id!;

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