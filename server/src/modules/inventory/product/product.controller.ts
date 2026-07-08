import { IdParams } from "@/modules/base/base.types";
import { assertOrg } from "@/modules/base/base.services";
import * as ProductServices from "./product.services";

import { 
  NextFunction, 
  Request, 
  Response
} from "express";

import { 
  ProductInsertRequest, 
  ProductUpdate, 
  VariantUpdate 
} from "./product.types";


type UpdateBody = ProductUpdate | VariantUpdate;

export const getAll = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    const orgID = req.context.org.id;

    const products = await ProductServices.getAll(orgID);

    res.status(200).json({
      'success': true,
      'message': 'Products was retrieved.',
      'products': products
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const store = async (
  req: Request<any, any, ProductInsertRequest>,
  res: Response,
  next: NextFunction
) => {
  try {
    assertOrg(req);

    const orgID = req.context.org.id
    const orgMemID = req.context.org.memID;
    const { product, variants } = req.body;

    await ProductServices.store(
      product,
      orgID,
      orgMemID,
      variants
    );

    res.status(201).json({
      'success': true,
      'message': 'Product information was stored.'
    });
  }
  catch (error: unknown) {
    next(error);
  }
}

export const update = () => updateHandler<ProductUpdate>(
    'organization_products',
    'Product was updated.'
  );

export const updateVariant = () => updateHandler<VariantUpdate>(
    'product_variants',
    'Product variant was updated.'
  );

export const deleteProduct = () => deleteHandler(
    'organization_products',
    'Product was deleted.'
  );

export const deleteVariant = () => deleteHandler(
    'product_variants',
    'Product variant was deleted.'
  );

const updateHandler = <T extends UpdateBody>(
  table: 'organization_products' | 'product_variants',
  successMessage: string
) => {
  return async (
    req: Request<IdParams, any, T>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      assertOrg(req);

      const data = req.body;
      const id = req.params.id;
      const orgID = req.context.org.id;

      await ProductServices.update(id, orgID, data, table);

      res.status(200).json({
        success: true,
        message: successMessage,
      });
    } catch (error: unknown) {
      next(error);
    }
  };
}

const deleteHandler = (
  table: 'organization_products' | 'product_variants',
  successMessage: string
) => {
  return async (
    req: Request<IdParams>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      assertOrg(req);
      
      const id = req.params.id!;

      await ProductServices.deleteHandler(id, table);

      res.status(200).json({
        'success': true,
        'message': successMessage
      });
    }
    catch (error: unknown) {
      next(error);
    }
  }
}
