import * as MovementServices from "./movement.services";
import { MovementInsert, MovementUpdate } from "./movement.types";
import { NextFunction, Request, Response } from "express";


export const get = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const branchID = req.branch?.id;

    const data = await MovementServices.getAll(branchID!);

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
    const movement = req.body;
    const orgMemID = req.org?.orgmemID;
    const branchID = req.branch?.id;

    await MovementServices.store(
      movement,
      orgMemID!,
      branchID!
    );

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
  req: Request<any, any, MovementUpdate>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;
    const branchID = req.branch?.id!;
    const movement = req.body;

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
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id!;

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
