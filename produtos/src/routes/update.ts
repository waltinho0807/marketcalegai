import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
  BadRequestError,
} from '@marketcalegari/common';
import { Produto } from '../models/produto';
import {ProdutoUpdatedPublisher} from '../events/publisher/produto-updated-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.put(
  '/api/produtos/:id',
  requireAuth,
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be provided and must be greater than 0'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const produto = await Produto.findById(req.params.id);

    if (!produto) {
      throw new NotFoundError();
    }

    if(produto.orderId){
      throw new BadRequestError('Produto em falta');
    }

    if (produto.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    produto.set({
      title: req.body.title,
      price: req.body.price,
    });
    await produto.save();
    new ProdutoUpdatedPublisher(natsWrapper.client).publish({
      id: produto.id,
      title: produto.title,
      price: produto.price,
      userId: produto.userId,
      img: produto.img,
      category: produto.category,
      version: produto.version
    });

    res.send(produto);
  }
);

export { router as updateProdutoRouter };
