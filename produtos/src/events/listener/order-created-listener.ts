import { Message} from 'node-nats-streaming';
import { Listener, OrderCreatedEvent, Subjects} from '@marketcalegari/common';
import {queueGroupName} from './queue-group-name';
import { Produto } from '../../models/produto';
import { ProdutoUpdatedPublisher} from '../publisher/produto-updated-publisher';


export class OrderCreatedListener extends Listener<OrderCreatedEvent>{
    readonly subject = Subjects.OderCreated;
    queueGroupName =  queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message){
        const produto = await Produto.findById(data.produto.id);

        if (!produto) {
            throw new Error('Produto não encontrado');
        }

        produto.set({orderId: data.id});

        await produto.save();
        await new ProdutoUpdatedPublisher(this.client).publish({
            id: produto.id,
            title: produto.title,
            price: produto.price,
            img: produto.img,
            category: produto.category,
            userId: produto.userId,
            orderId: produto.orderId,
            version: produto.version
            
        })

        msg.ack();
    }
}