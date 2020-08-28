import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEvent } from '@marketcalegari/common';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCancelledListener } from '../order-cancelled-lisener';
import { Produto } from '../../../models/produto';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const orderId = mongoose.Types.ObjectId().toHexString();
  const produto = Produto.build({
    title: 'concert',
    price: 20,
    img: 'dsfd.jpg',
    category: 'dfdffdsd',
    userId: 'asdf',
  });
  produto.set({ orderId });
  await produto.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    produto: {
      id: produto.id,
    },
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { msg, data, produto, orderId, listener };
};

it('updates the ticket, publishes an event, and acks the message', async () => {
  const { msg, data, produto, orderId, listener } = await setup();

  await listener.onMessage(data, msg);

  const updatedProduto = await Produto.findById(produto.id);
  expect(updatedProduto!.orderId).not.toBeDefined();
  expect(msg.ack).toHaveBeenCalled();
  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
