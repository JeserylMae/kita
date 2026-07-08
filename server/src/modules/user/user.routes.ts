import * as AuthController from './auth.controllers';
import * as UserController from './user.controller';

import { Router } from 'express';
import {
  requireGuest,
  requireAuth,
  verifyBrcPermission
} from '@/middleware/auth.middleware';
import { validateBody, validateIdParams } from '@/middleware/validation.middleware';
import { ResetPasswordParamsSchema, SignupParamsSchema, UserUpdateSchema } from './user.schemas';


const userRouter = Router();

userRouter.post('/signup', 
  validateBody(SignupParamsSchema),
  AuthController.signup
);

userRouter.post('/signin', 
  requireGuest,
  AuthController.signin
);

userRouter.post('/logout', 
  requireAuth,
  AuthController.logout
);

userRouter.post('/reset-password', 
  validateBody(ResetPasswordParamsSchema),
  AuthController.resetPassword
);

userRouter.post('/forgot-password', 
  AuthController.requestForgotPassword
);

userRouter.get('/me',
  requireAuth,
  verifyBrcPermission('select.user'),
  UserController.me
);

userRouter.patch('/:id',
  requireAuth,
  verifyBrcPermission('update.user'),
  validateIdParams,
  validateBody(UserUpdateSchema),
  UserController.update
);

export default userRouter;
