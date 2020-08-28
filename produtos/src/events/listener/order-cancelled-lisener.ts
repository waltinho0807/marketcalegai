import { Listener, OrderCancelledEvent, Subjects } from '@marketcalegari/common';
import { Message } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Produto } from '../../models/produto';
import { ProdutoUpdatedPublisher } from '../publisher/produto-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
 readonly subject=  Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const produto = await Produto.findById(data.produto.id);

    if (!produto) {
      throw new Error('Ticket not found');
    }

    produto.set({ orderId: undefined });
    await produto.save();
    await new ProdutoUpdatedPublisher(this.client).publish({
      id: produto.id,
      orderId: produto.orderId,
      userId: produto.userId,
      price: produto.price,
      title: produto.title,
      img: produto.img,
      category: produto.category,
      version: produto.version,
    });

    msg.ack();
  }
}
