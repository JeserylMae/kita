import { Router } from 'express';
import AuthController from './auth.controllers';
import { requireGuest, verifyToken } from '@/middleware/auth.middleware';


const userRouter = Router();

userRouter.post('/signup', AuthController.signup);
userRouter.post(
  '/signin', 
  requireGuest,
  AuthController.signin
);

userRouter.post(
  '/logout', 
  verifyToken,
  AuthController.logout
);

userRouter.post('/reset-password', AuthController.resetPassword);
userRouter.post('/forgot-password', AuthController.requestForgotPassword);

export default userRouter;
