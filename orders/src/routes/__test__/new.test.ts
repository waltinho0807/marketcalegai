import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Produto } from '../../models/produto';
import { natsWrapper} from '../../nats-wrapper';

it('returns an error if the ticket does not exist', async () => {
  const produtoId = mongoose.Types.ObjectId();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ produtoId })
    .expect(404);
});

it('returns an error if the ticket is already reserved', async () => {
  const produto = Produto.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await produto.save();
  const order = Order.build({
    produto,
    userId: 'laskdflkajsdf',
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();
  
  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ produtoId: produto.id })
    .expect(400);
    
    
});

it('reserves a ticket', async () => {
  const produto = Produto.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await produto.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ produtoId: produto.id })
    .expect(201);
});

it('emits an order created event', async ()=>{
  const produto = Produto.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await produto.save();

  await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({ produtoId: produto.id })
    .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});
