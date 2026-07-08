import { IdParams } from "@/modules/base/base.types";
import { assertBrc } from "@/modules/base/base.services";
import { MovementInsert, MovementUpdate } from "./movement.types";
import { NextFunction, Request, Response } from "express";

import * as MovementServices from "./movement.services";


export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const branchID = req.context.brc.id;

    const data = await MovementServices.getAll(branchID);

    res.status(200).json({
      'success': true,
      'message': 'Inventory movements was retrieved.',
      'movements': data
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const store = async (
  req: Request<any, any, MovementInsert>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const movement = req.body;
    const branchID = req.context.brc.id;
    const orgMemID = req.context.org.memID;

    await MovementServices
      .store(movement, orgMemID, branchID);

    res.status(201).json({
      'success': true,
      'message': 'Inventory movement was created.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const update = async (
  req: Request<IdParams, any, MovementUpdate>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const id = req.params.id;
    const movement = req.body;
    const branchID = req.context.brc.id;

    await MovementServices.update(id, branchID, movement);

    res.status(201).json({
      'success': true,
      'message': 'Inventory movement was updated.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const deleteMovement = async (
  req: Request<IdParams>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertBrc(req);

    const id = req.params.id;

    await MovementServices.deleteMovement(id);

    res.status(200).json({
      'success': true,
      'message': 'Inventory movement was deleted.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}
