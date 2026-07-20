import * as AuthController from './auth.controllers';
import * as UserController from './user.controller';

import { Router } from 'express';
import {
  requireGuest,
  requireAuth,
  verifyBrcPermission
} from '@/middleware/auth.middleware';
import { validateBody, validateIdParams } from '@/middleware/validation.middleware';
import { 
  ResetPasswordParamsSchema, 
  SignupParamsSchema, 
  UserUpdateSchema,
  ForgotPasswordParamsSchema
} from './user.schemas';


const userRouter = Router();

userRouter.post('/signup', 
  validateBody(SignupParamsSchema),
  AuthController.signup
);

userRouter.post('/signin', 
  requireGuest,
  AuthController.signin
);

userRouter.delete('/logout', 
  requireAuth,
  AuthController.logout
);

userRouter.post('/refresh',
  requireAuth,
  AuthController.refresh
);

userRouter.post('/reset-password', 
  validateBody(ResetPasswordParamsSchema),
  AuthController.resetPassword
);

userRouter.post('/forgot-password', 
  validateBody(ForgotPasswordParamsSchema),
  AuthController.requestForgotPassword
);

userRouter.get('/verify-email', 
  AuthController.verifyEmail
);

userRouter.post('/resend-verification', 
  validateBody(ForgotPasswordParamsSchema),
  AuthController.resendEmailVerification
);

userRouter.get('/me',
  requireAuth,
  UserController.me
);

userRouter.patch('/me/:id',
  requireAuth,
  validateIdParams,
  validateBody(UserUpdateSchema),
  UserController.update
);

userRouter.patch('/:id',
  requireAuth,
  verifyBrcPermission('update.user'),
  validateIdParams,
  validateBody(UserUpdateSchema),
  UserController.update
);

export default userRouter;
