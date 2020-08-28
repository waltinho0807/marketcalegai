import {Publisher, Subjects, ProdutoCreatedEvent } from '@marketcalegari/common';

export class ProdutoCreatedPublisher extends Publisher<ProdutoCreatedEvent>{
    readonly subject = Subjects.ProdutoCreated;
}
