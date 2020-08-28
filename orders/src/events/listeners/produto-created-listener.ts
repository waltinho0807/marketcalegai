import {Message} from 'node-nats-streaming';
import {Subjects, Listener, ProdutoCreatedEvent} from '@marketcalegari/common';
import { Produto} from '../../models/produto';
import {queueGroupName} from './queue-group-name';

export class ProdutoCreatedListener extends Listener<ProdutoCreatedEvent>{
    readonly subject = Subjects.ProdutoCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: ProdutoCreatedEvent['data'], msg: Message){
        const {id, title, price} = data;

        const produto = Produto.build({
            id, title, price
        });
        await produto.save();

        msg.ack();
    }
}