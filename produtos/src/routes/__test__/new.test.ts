import request from 'supertest';
import { app } from '../../app';
import {Produto} from '../../models/produto';
import { natsWrapper } from '../../nats-wrapper';



it('has a route handler listening to /api/produtos for post requests', async () => {
  const response = await request(app).post('/api/produtos').send({});

  expect(response.status).not.toEqual(404);
});

it('can only be accessed if the user is signed in', async () => {
  
  await request(app).post('/api/produtos').send({}).expect(400);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
  .post('/api/produtos')
  .set('Cookie', global.signin())
  .send({});
 
  expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      title: '',
      price: 10,
    })
    .expect(400);

  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      price: 10,
    })
    .expect(400);

});

it('returns an error if an invalid price is provided', async () => {
  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkjf',
      price: -10,
    })
    .expect(400);

  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      title: 'laskdfj',
    })
    .expect(400);

});

it('creates a ticket with valid inputs', async () => {
  let produtos = await Produto.find({});
  expect(produtos.length).toEqual(0);

  const title = 'dfsdfasf';
  const img = 'dsdsdadsf.jpg';
  const category = 'frios';

  await request(app)
  .post('/api/produtos')
  .set('Cookie', global.signin())
  .send({
    title,
    price: 20,
    img,
    category
  })
  .expect(201);

  produtos = await Produto.find({});
  expect(produtos.length).toEqual(1);
  expect(produtos[0].price).toEqual(20);
  expect(produtos[0].title).toEqual(title);
  expect(produtos[0].img).toEqual(img);
  expect(produtos[0].category).toEqual(category);
});

it('publishes an event', async () => {
  const title = 'asldkfj';

  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      title,
      price: 20,
      img: 'dfddfgfg',
      category: 'fgfdgdfg'
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

});

