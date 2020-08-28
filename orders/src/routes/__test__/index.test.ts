import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Produto } from '../../models/produto';

const buildProduto = async () => {
  const produto = Produto.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await produto.save();

  return produto;
};

it('fetches orders for an particular user', async () => {
  // Create three tickets
  const produtoOne = await buildProduto();
  const produtoTwo = await buildProduto();
  const produtoThree = await buildProduto();


  const userOne = global.signin();
  const userTwo = global.signin();

  
  
  // Create one order as User #1
  await request(app)
    .post('/api/orders')
    .set('Cookie', userOne)
    .send({ produtoId: produtoOne.id })
    .expect(201); 
  // Create two orders as User #2
  const { body: orderOne } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ produtoId: produtoTwo.id })
    .expect(201);
  const { body: orderTwo } = await request(app)
    .post('/api/orders')
    .set('Cookie', userTwo)
    .send({ produtoId: produtoThree.id })
    .expect(201);
  
  // Make request to get orders for User #2
  const response = await request(app)
    .get('/api/orders')
    .set('Cookie', userTwo)
    .expect(200);

    
    expect(response.body.length).toEqual(2);
    expect(response.body[0].id).toEqual(orderOne.id);
    expect(response.body[1].id).toEqual(orderTwo.id);
    expect(response.body[0].produto.id).toEqual(produtoTwo.id);
    expect(response.body[1].produto.id).toEqual(produtoThree.id);
  
 

  
});
