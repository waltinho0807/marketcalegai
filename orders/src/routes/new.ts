import mongoose from 'mongoose';
import express, { Request, Response } from 'express';
import {
  requireAuth,
  validateRequest,
  NotFoundError,
  OrderStatus,
  BadRequestError,
} from '@marketcalegari/common';
import { body } from 'express-validator';
import { Produto } from '../models/produto';
import { Order } from '../models/order';
import {OrderCreatedPublisher} from '../events/publishers/order-created-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('produtoId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { produtoId } = req.body;

    // Find the ticket the user is trying to order in the database
    const produto = await Produto.findById(produtoId);
    if (!produto) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await produto.isReserved();
    if (isReserved) {
      throw new BadRequestError('Produto is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      produto,
    });
    await order.save();

    // Publish an event saying that an order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
       status: order.status,
       userId: order.userId,
       expiresAt: order.expiresAt.toISOString(),
       version: order.version,
       produto: {
         id: produto.id,
         price: produto.price,
       }
    })

    res.status(201).send(order);
  }
);

export { router as newOrderRouter };
