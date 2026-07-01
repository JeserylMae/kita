import { Router } from 'express';
import { ProductServices } from './product.services';
import { ProductController } from './product.controller';
import { verifyPermission, verifyToken } from '@/middleware/auth.middleware';


const productRouter = Router();

productRouter.get('/',
  verifyToken,
  verifyPermission('select.orgprd'),
  ProductController.getAll
);

productRouter.put('/',
  verifyToken,
  verifyPermission('insert.orgprd'),
  ProductController.store
);

productRouter.patch('/', 
  verifyToken,
  verifyPermission('update.orgprd'),
  ProductController.update
);

productRouter.patch('/variant',
  verifyToken,
  verifyPermission('update.prdvar'),
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  verifyToken,
  verifyPermission('delete.orgprd'),
  ProductController.delete
);

productRouter.delete('/:id/variant',
  verifyToken,
  verifyPermission('delete.prdvar'),
  ProductController.deleteVariant
);

export default productRouter;