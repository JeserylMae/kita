import { BadRequest } from "@/errors";
import { TypedRequest } from "@/config/types";
import { ZodType } from "zod";
import { NextFunction, Response } from "express";
import { IdParamsSchema } from "@/modules/base/base.types";


export const validateBody = (schema: ZodType) => (
    req: TypedRequest,
    res: Response,
    next: NextFunction
  ) => {
    validateHandler(schema, req.body, next);
  }

export const validateIdParams = (
  req: TypedRequest,
  res: Response,
  next: NextFunction
) => {
  validateHandler(IdParamsSchema, req.params, next);
}

const validateHandler = <T> (
  schema: ZodType, 
  content: T, 
  next: NextFunction
) => {
  try {
    const result = schema.safeParse(content);

    if (result.error) {
      throw new BadRequest(result.error.message);
    }

    return next();
  }
  catch (error: unknown) {
    return next(error);
  }
}