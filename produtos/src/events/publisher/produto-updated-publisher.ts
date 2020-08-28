import {Publisher, Subjects, ProdutoUpdatedEvent } from '@marketcalegari/common';

export class ProdutoUpdatedPublisher extends Publisher<ProdutoUpdatedEvent>{
    readonly subject = Subjects.ProdutoUpdated;
}
