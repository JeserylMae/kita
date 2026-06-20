import express from 'express';
import userRouter from '@/modules/user/user.routes';
import cookieParser from 'cookie-parser';


interface Params {
  app: express.Application
};

export const loader = ({ app }: Params) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  
  app.use('/auth', userRouter);

  app.get('/status', (req, res) => {
    return res.status(200).end("OK");
  });
}
