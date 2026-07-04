import { ProductServices } from "./product.services";
import { ProductUpdate, VariantUpdate } from "./product.types";
import { NextFunction, Request, Response } from "express";


type UpdateBody = ProductUpdate | VariantUpdate;

export class ProductController {
  public static async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgID = req.org?.id;

      const products = await ProductServices.getAll(orgID!);

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

  public static async store(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const orgID = req.org?.id;
      const orgMemID = req.org?.orgmemID;
      const { product, variants } = req.body;

      await ProductServices.store(
        product,
        orgID!,
        orgMemID!,
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

  public static update = ProductController
    .updateHandler<ProductUpdate>(
      'organization_products',
      'Product was updated.'
    );
  
  public static updateVariant = ProductController
    .updateHandler<VariantUpdate>(
      'product_variants',
      'Product variant was updated.'
    );

  public static delete = ProductController
    .deleteHandler(
      'organization_products',
      'Product was deleted.'
    );

  public static deleteVariant = ProductController
    .deleteHandler(
      'product_variants',
      'Product variant was deleted.'
    );

  private static updateHandler<T extends UpdateBody>(
    table: 'organization_products' | 'product_variants',
    successMessage: string
  ) {
    return async (
      req: Request<any, any, T>,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const data = req.body;
        const id = req.params.id!;
        const orgID = req.org?.id!;

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

  private static deleteHandler(
    table: 'organization_products' | 'product_variants',
    successMessage: string
  ) {
    return async (
      req: Request,
      res: Response,
      next: NextFunction
    ) => {
      try {
        const id = req.params.id!;

        await ProductServices.delete(id, table);

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
}