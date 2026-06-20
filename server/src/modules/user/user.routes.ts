import { Router } from 'express';
import AuthController from './auth.controllers';


const userRouter = Router();

userRouter.post('/signup', AuthController.signup);
userRouter.post('/signin', AuthController.signin);
userRouter.post('/logout', AuthController.logout);
userRouter.post('/reset-password', AuthController.resetPassword);
userRouter.post('/forgot-password', AuthController.requestForgotPassword);

export default userRouter;