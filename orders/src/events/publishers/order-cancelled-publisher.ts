import {Subjects, Publisher, OrderCancelledEvent} from '@marketcalegari/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
     readonly subject = Subjects.OrderCancelled;
}