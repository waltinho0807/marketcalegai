import {Message} from 'node-nats-streaming';
import {Subjects, Listener, ProdutoUpdatedEvent} from '@marketcalegari/common';
import { Produto} from '../../models/produto';
import {queueGroupName} from './queue-group-name';

export class ProdutoUpdatedListener extends Listener<ProdutoUpdatedEvent>{
    readonly subject = Subjects.ProdutoUpdated;
    queueGroupName = queueGroupName;

    async onMessage(data: ProdutoUpdatedEvent['data'], msg: Message){

        const produto = await Produto.findOne({
            _id: data.id,
            version: data.version - 1
        });

        if(!produto){
            throw new Error('Produto Not found');
        }

        const {title, price} = data;
        produto.set({title, price});

        await produto.save();

        msg.ack();
    }
}