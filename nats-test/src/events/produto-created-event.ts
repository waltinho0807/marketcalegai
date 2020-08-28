import { Subjects } from './subjects';

export interface ProdutoCreatedEvent {
  subject: Subjects.ProdutoCreated;
  data: {
    id: string;
    title: string;
    price: number;
    img: string;
    category: string;
  };
}
