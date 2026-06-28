import { Router } from 'express';
import AuthController from './auth.controllers';
import { UserMiddleware } from './user.middleware';


const userRouter = Router();

userRouter.post('/signup', AuthController.signup);
userRouter.post(
  '/signin', 
  UserMiddleware.requireGuest,
  AuthController.signin
);

userRouter.post(
  '/logout', 
  UserMiddleware.attachUser,
  AuthController.logout
);

userRouter.post('/reset-password', AuthController.resetPassword);
userRouter.post('/forgot-password', AuthController.requestForgotPassword);

export default userRouter;
