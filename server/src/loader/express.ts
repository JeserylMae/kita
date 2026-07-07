import express from 'express';
import userRouter from '@/modules/user/user.routes';
import cookieParser from 'cookie-parser';
import { ErrorMiddleware } from '@/middleware/error.middleware';
import organizationRouter from '@/modules/organization/organization.routes';
import invitationRouter from '@/modules/invitation/invitation.routes';
import branchRouter from '@/modules/branch/branch.routes';
import txnRouter from '@/modules/inventory/transaction/transaction.routes';
import movementRouter from '@/modules/inventory/movement/movement.routes';
import productRouter from '@/modules/inventory/product/product.routes';
import itemRouter from '@/modules/inventory/items/items.routes';


interface Params {
  app: express.Application
};

export const loader = ({ app }: Params) => {
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }));
  
  app.use('/auth', userRouter);
  app.use('/organization', organizationRouter);
  app.use('/invitation', invitationRouter);
  app.use('/branch', branchRouter);
  app.use('/inventory/movement', movementRouter);
  app.use('/product', productRouter);
  
  app.use('/inventory/items', itemRouter);

  app.use('transaction', txnRouter);

  app.use(ErrorMiddleware.handleError);

  app.get('/status', (req, res) => {
    return res.status(200).end("OK");
  });
}
