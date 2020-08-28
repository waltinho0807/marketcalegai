import { Publisher } from './base-publisher';
import { ProdutoCreatedEvent } from './produto-created-event';
import { Subjects } from './subjects';

export class ProdutoCreatedPublisher extends Publisher<ProdutoCreatedEvent> {
  readonly subject = Subjects.ProdutoCreated ;
}
