import express, {Request, Response} from 'express';
import {Produto} from '../models/produto';

const router = express.Router();

router.get('/api/produtos', async (req: Request, res: Response) =>{
    const produtos = await Produto.find({});

    res.send(produtos);
});

export {router as indexProdutoRouter}