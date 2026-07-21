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


const prdMiddlewares = [
  authorizeOrganizationAccess,
  validateIdParams,
]

const productRouter = Router();

productRouter.use(requireAuth);
productRouter.use(requireOrg);
productRouter.use(verifyOrgPermission);

productRouter.get('/:id',
  ...prdMiddlewares,
  ProductController.getAll
);

productRouter.post('/:id',
  authorizeOrganizationAccess,
  validateIdParams,
  validateBody(ProductInsertRequestSchema),
  ProductController.store
);

productRouter.patch('/:id',
  ...prdMiddlewares,
  validateBody(ProductUpdateSchema),
  ProductController.update
);

productRouter.patch('/variant/:id',
  ...prdMiddlewares,
  validateBody(VariantUpdateSchema),
  ProductController.updateVariant 
);

productRouter.delete('/:id',
  ...prdMiddlewares,
  ProductController.deleteProduct
);

productRouter.delete('/variant/:id',
  ...prdMiddlewares,
  ProductController.deleteVariant
);

export default productRouter;