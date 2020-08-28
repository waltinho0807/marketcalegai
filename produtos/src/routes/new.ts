import express, { Request, Response } from 'express';
import {body} from 'express-validator';
import { requireAuth, validateRequest } from '@marketcalegari/common';
import {Produto} from '../models/produto';
import {ProdutoCreatedPublisher} from '../events/publisher/produto-created-publisher';
import {natsWrapper} from '../nats-wrapper';

const router = express.Router();

router.post('/api/produtos', requireAuth, [
  body('title')
  .not()
  .isEmpty()
  .withMessage('Title is require'),
  body('price')
  .isFloat({gt: 0})
  .withMessage('Price is greater than 0'),
  body('category')
  .not()
  .isEmpty()
  .withMessage('category is require'),
], validateRequest, async (req: Request, res: Response) => {

  const {title, price, img, category} = req.body;

  const produto = Produto.build({
    title,
    price,
    img,
    category,
    userId: req.currentUser!.id
  });
  await produto.save();

  new ProdutoCreatedPublisher(natsWrapper.client).publish({
    id: produto.id,
    title: produto.title,
    price: produto.price,
    img: produto.img,
    category: produto.category,
    userId: produto.userId,
    version: produto.version
    
  })

  res.status(201).send(produto);
  
});

export { router as createProdutoRouter };
