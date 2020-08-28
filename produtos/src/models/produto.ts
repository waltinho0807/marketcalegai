import mongoose from 'mongoose';
import {updateIfCurrentPlugin} from 'mongoose-update-if-current';

interface ProdutoAttrs {
    title: string;
    price: number;
    img: string;
    category: string;
    userId: string;
}

interface ProdutoDoc extends mongoose.Document{
    title: string;
    price: number;
    img: string;
    category: string;
    userId: string;
    version: number;
    orderId?: string;
}

interface ProdutoModel extends mongoose.Model<ProdutoDoc> {
    build(attrs: ProdutoAttrs): ProdutoDoc;
}

const ProdutoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    orderId: {
        type: String
    }
},{
    toJSON: {
        transform(doc, ret){
            ret.id = ret._id;
            delete ret._id;

        }
    }
});

ProdutoSchema.set('versionKey', 'version');
ProdutoSchema.plugin(updateIfCurrentPlugin);

ProdutoSchema.statics.build = (attrs: ProdutoAttrs)=>{
    return new Produto(attrs);
};

const Produto = mongoose.model<ProdutoDoc, ProdutoModel>('Produto', ProdutoSchema);

export {Produto};