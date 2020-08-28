import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats-wrapper';
import { Produto } from '../../models/produto';



it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .put(`/api/produtos/${id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'aslkdfj',
      price: 20,
    })
    .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
   await request(app)
    .put(`/api/produtos/${id}`)
    .send({
      title: 'aslkdfj',
      price: 20,
      img: 'dssdfsdf',
      category: 'fgfgdgds'
    })
    .expect(404);

    console.log(id);
});

it('returns a 401 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
      title: 'asldkfj',
      price: 20,
      category: 'wawa',
      img: 'sddsds'
    });


  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', global.signin())
    .send({
      title: 'alskdjflskjdf',
      price: 10,
    })
    .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/produtos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      category: 'wawa',
      img: 'sddsds'
      
    });

  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: '',
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'alskdfjj',
      price: -10,
    })
    .expect(400);
});

it('updates the ticket provided valid inputs', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/produtos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      category: 'wawa',
      img: 'sddsds'
    });

    console.log(response.body.id)

  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  const ticketResponse = await request(app)
    .get(`/api/produtos/${response.body.id}`)
    .send();

  expect(ticketResponse.body.title).toEqual('new title');
  expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/produtos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      img: 'sdfsdfsd',
      category: 'gdfgdfgdf'
    });

  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

it('rejects updates if the ticket is reserved', async () => {
  const cookie = global.signin();

  const response = await request(app)
    .post('/api/produtos')
    .set('Cookie', cookie)
    .send({
      title: 'asldkfj',
      price: 20,
      img: 'sdfsdfsd',
      category: 'gdfgdfgdf'
    });

  const ticket = await Produto.findById(response.body.id);
  ticket!.set({ orderId: mongoose.Types.ObjectId().toHexString() });
  await ticket!.save();

  await request(app)
    .put(`/api/produtos/${response.body.id}`)
    .set('Cookie', cookie)
    .send({
      title: 'new title',
      price: 100,
    })
    .expect(400);
});


