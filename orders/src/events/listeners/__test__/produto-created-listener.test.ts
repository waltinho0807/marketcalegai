import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { ProdutoCreatedEvent } from '@marketcalegari/common';
import { ProdutoCreatedListener } from '../produto-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Produto } from '../../../models/produto';

const setup = async () => {
  // create an instance of the listener
  const listener = new ProdutoCreatedListener(natsWrapper.client);

  // create a fake data event
  const data: ProdutoCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    img: 'dffdf.jpg',
    category: 'dfsdfsdf',
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure a ticket was created!
  const produto = await Produto.findById(data.id);

  expect(produto).toBeDefined();
  expect(produto!.title).toEqual(data.title);
  expect(produto!.price).toEqual(data.price);
});

it('acks the message', async () => {
  const { data, listener, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // write assertions to make sure ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
