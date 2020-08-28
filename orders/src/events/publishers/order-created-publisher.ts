import {Subjects, Publisher, OrderCreatedEvent} from '@marketcalegari/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
     readonly subject = Subjects.OderCreated;
}