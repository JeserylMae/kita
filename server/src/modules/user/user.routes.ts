import * as AuthController from './auth.controllers';
import * as UserController from './user.controller';

import { Router } from 'express';
import * as authMiddleware from '@/middleware/auth.middleware';


const userRouter = Router();

userRouter.post('/signup', 
  AuthController.signup
);

userRouter.post('/signin', 
  authMiddleware.requireGuest,
  AuthController.signin
);

userRouter.post('/logout', 
  authMiddleware.verifyToken,
  AuthController.logout
);

userRouter.post('/reset-password', 
  AuthController.resetPassword
);

userRouter.post('/forgot-password', 
  AuthController.requestForgotPassword
);

userRouter.get('/me',
  authMiddleware.verifyToken,
  authMiddleware.verifyPermission,
  UserController.me
)

export default userRouter;
