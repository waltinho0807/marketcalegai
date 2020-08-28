import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { ProdutoUpdatedEvent } from '@marketcalegari/common';
import { ProdutoUpdatedListener } from '../produto-updated-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Produto } from '../../../models/produto';

const setup = async () => {
  // Create a listener
  const listener = new ProdutoUpdatedListener(natsWrapper.client);

  // Create and save a ticket
  const produto = Produto.build({
    id: mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  
  await produto.save();

  // Create a fake data object
  const data: ProdutoUpdatedEvent['data'] = {
    id: produto.id,
    version: produto.version + 1,
    title: 'new concert',
    price: 999,
    img: 'dfdfgfg.jpg',
    category: 'sddasdad',
    userId: 'ablskdjf',
  };

  // Create a fake msg object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // return all of this stuff
  return { msg, data, produto, listener };
};

it('finds, updates, and saves a ticket', async () => {
  const { msg, data, produto, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Produto.findById(produto.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it('acks the message', async () => {
  const { msg, data, listener } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, produto } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (err) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
