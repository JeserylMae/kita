import { IdParams } from "@/modules/base/base.types";
import { assertBrc } from "@/modules/base/base.services";
import { ItemInsert, ItemPagination, ItemUpdate } from "./items.types";
import { NextFunction, Request, Response } from "express";

import * as ItemsServices from "./items.services";
import { ItemPaginationSchema } from "./items.schemas";


export const create = async (
  req: Request<any, any, ItemInsert>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const item = req.body;
    const userID = req.context.user.id;
    const branchID = req.context.brc.id;
    const userRole = req.context.brc.role;

    await ItemsServices
      .store(item, branchID, userID, userRole);

    res.status(201).json({
      'success': true,
      'message': 'New inventory item was created.'
    });
  }
  catch(error: unknown) {
    next(error);
  }
}

export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const options = ItemPaginationSchema.parse(req.query);

    for (const [key, val] of Object.entries(options)){
      console.log(`${key}: ${val} - ${typeof val}`);
    }

    const orgID = req.context.org.id;
    const branchID = req.context.brc.id;

    const {data:items, hasNextPage, nextCursor} = await ItemsServices
      .getAllItems(branchID, orgID, options);

    res.status(200).json({
      'success': true,
      'message': 'Inventory items was retrieved.',
      'items': items,
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

export const update = async (
  req: Request<IdParams, any, ItemUpdate>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const item = req.body;
    const itemID = req.params.id;
    const branchID = req.context.brc.id;

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

export const deletItem = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try { 
    assertBrc(req);

    const id = req.params.id;

    await ItemsServices.deleteItem(id);

    res.status(200).json({
      'success': true,
      'message': 'Inventory item was deleted.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}
