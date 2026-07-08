import { Router } from 'express';
import * as ProductController from './product.controller';
import { requireAuth, requireOrg, verifyOrgPermission } from '@/middleware/auth.middleware';


const productRouter = Router();

productRouter.get('/',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.getAll
);

productRouter.post('/',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.store
);

productRouter.patch('/:id', 
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.update
);

productRouter.patch('/variant/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.deleteProduct
);

productRouter.delete('/variant/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  ProductController.deleteVariant
);

export default productRouter;