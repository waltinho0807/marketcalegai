import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current'
import { Order, OrderStatus } from './order';

interface ProdutoAttrs {
  id: string;
  title: string;
  price: number;
}

export interface ProdutoDoc extends mongoose.Document {
  title: string;
  price: number;
  version: number;
  isReserved(): Promise<boolean>;
}

interface ProdutoModel extends mongoose.Model<ProdutoDoc> {
  build(attrs: ProdutoAttrs): ProdutoDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProdutoDoc | null>;

}

const produtoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

produtoSchema.set('versionKey', 'version');
produtoSchema.plugin(updateIfCurrentPlugin);

produtoSchema.statics.findByEvent = (event: { id: string; version: number }) => {
  return Produto.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};


produtoSchema.statics.build = (attrs: ProdutoAttrs) => {
  return new Produto({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price
  });
};
produtoSchema.methods.isReserved = async function () {
  // this === the ticket document that we just called 'isReserved' on
  const existingOrder = await Order.findOne({
    produto: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });

  return !!existingOrder;
};

const Produto = mongoose.model<ProdutoDoc, ProdutoModel>('Produto', produtoSchema);

export { Produto };
