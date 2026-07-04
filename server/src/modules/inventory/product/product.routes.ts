import { Router } from 'express';
import * as ProductController from './product.controller';
import { verifyPermission, verifyToken } from '@/middleware/auth.middleware';


const productRouter = Router();

productRouter.get('/',
  verifyToken,
  verifyPermission('select.orgprd'),
  ProductController.getAll
);

productRouter.post('/',
  verifyToken,
  verifyPermission('insert.orgprd'),
  ProductController.store
);

productRouter.patch('/:id', 
  verifyToken,
  verifyPermission('update.orgprd'),
  ProductController.update
);

productRouter.patch('/variant/:id',
  verifyToken,
  verifyPermission('update.prdvar'),
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  verifyToken,
  verifyPermission('delete.orgprd'),
  ProductController.deleteProduct
);

productRouter.delete('/variant/:id',
  verifyToken,
  verifyPermission('delete.prdvar'),
  ProductController.deleteVariant
);

export default productRouter;