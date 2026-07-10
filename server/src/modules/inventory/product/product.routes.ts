import { Router } from 'express';
import * as ProductController from './product.controller';

import { 
  requireAuth, 
  requireOrg, 
  verifyOrgPermission 
} from '@/middleware/auth.middleware';

import { 
  validateBody, 
  validateIdParams 
} from '@/middleware/validation.middleware';

import { 
  ProductInsertRequestSchema, 
  ProductUpdateSchema, 
  VariantUpdateSchema 
} from './product.schemas';


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
  validateBody(ProductInsertRequestSchema),
  ProductController.store
);

productRouter.patch('/:id', 
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  validateBody(ProductUpdateSchema),
  ProductController.update
);

productRouter.patch('/variant/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  validateBody(VariantUpdateSchema),
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  ProductController.deleteProduct
);

productRouter.delete('/variant/:id',
  requireAuth,
  requireOrg,
  verifyOrgPermission,
  validateIdParams,
  ProductController.deleteVariant
);

export default productRouter;