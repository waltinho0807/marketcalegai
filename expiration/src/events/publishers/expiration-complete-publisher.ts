import {Subjects, Publisher, ExpirationCompleteEvent} from '@marketcalegari/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    readonly subject = Subjects.ExpirationComplete;
}