import { Subjects, Publisher, PaymentCreatedEvent } from '@marketcalegari/common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject =  Subjects.PaymentCreated;
}
