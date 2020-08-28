import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';
import { OrderCreatedEvent, OrderStatus } from '@marketcalegari/common';
import { OrderCreatedListener } from '../order-created-listener';
import { natsWrapper } from '../../../nats-wrapper';
import { Produto } from '../../../models/produto';


const setup = async () => {
  // Create an instance of the listener
  const listener = new OrderCreatedListener(natsWrapper.client);

  // Create and save a ticket
  const produto = Produto.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
    img: 'dfdsf.jpg',
    category: 'dsadad'
  });
  await produto.save();

  // Create the fake data event
  const data: OrderCreatedEvent['data'] = {
    id: mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: 'alskdjf',
    produto: {
      id: produto.id,
      price: produto.price,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, produto, data, msg };
};

it('sets the userId of the ticket', async () => {
  const { listener, produto, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduto = await Produto.findById(produto.id);

  console.log(updatedProduto!.orderId)

  expect(updatedProduto!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
  const { listener, produto, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it('publishes a ticket updated event', async () => {
  const { listener, produto, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const produtoUpdatedData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(data.id).toEqual(produtoUpdatedData.orderId);
});

