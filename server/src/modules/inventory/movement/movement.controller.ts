import { canAccessUser } from "@/modules/base/base.services";
import { NextFunction, Request, Response } from "express";
import { PassThrough } from "node:stream";
import { MovementServices } from "./movement.services";
import { MovementInsert, MovementUpdate } from "./movement.types";


export class MovementController {
  public static async get(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

  public static async store(
    req: Request<any, any, MovementInsert>,
    res: Response,
    next: NextFunction
  ) {
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

  public static async update(
    req: Request<any, any, MovementUpdate>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const movement = req.body;

      await MovementServices.update(movement);

      res.status(201).json({
        'success': true,
        'message': 'Inventory movement was updated.'
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
      const { id } = req.body;

      await MovementServices.delete(id);

      res.status(200).json({
        'success': true,
        'message': 'Inventory movement was deleted.'
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }
}