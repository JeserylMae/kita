import { Router } from 'express';
import { authorizeOrganizationAccess } from '@/middleware/authorization.middleware';

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

productRouter.use(requireAuth);
productRouter.use(requireOrg);
productRouter.use(verifyOrgPermission);
productRouter.use(authorizeOrganizationAccess);

productRouter.get('/',
  ProductController.getAll
);

productRouter.post('/',
  validateBody(ProductInsertRequestSchema),
  ProductController.store
);

productRouter.patch('/:id',
  validateIdParams,
  validateBody(ProductUpdateSchema),
  ProductController.update
);

productRouter.patch('/variant/:id',
  validateIdParams,
  validateBody(VariantUpdateSchema),
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  validateIdParams,
  ProductController.deleteProduct
);

productRouter.delete('/variant/:id',
  validateIdParams,
  ProductController.deleteVariant
);

export default productRouter;