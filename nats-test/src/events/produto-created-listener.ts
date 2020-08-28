import { Message } from 'node-nats-streaming';
import { Listener } from './base-listener';
import {ProdutoCreatedEvent} from './produto-created-event';
import {Subjects} from './subjects';

export class ProdutoCreatedListener extends Listener<ProdutoCreatedEvent> {
  readonly subject = Subjects.ProdutoCreated ;
  queueGroupName = 'payments-service';

  onMessage(data: ProdutoCreatedEvent['data'], msg: Message) {
    console.log('Event data!', data);

    console.log(data.id);
    console.log(data.title);
    console.log(data.img);
    console.log(data.category);

    msg.ack();
  }
}

