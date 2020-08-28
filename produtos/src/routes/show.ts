import express, {Request, Response, Router} from 'express';
import {NotFoundError} from '@marketcalegari/common';
import {Produto} from '../models/produto';

const router = express.Router();

router.get('/api/produtos/:id', async (req: Request, res: Response)=>{
    const produto = await Produto.findById(req.params.id);

    if(!produto){
        throw new NotFoundError();
    }

    res.send(produto)
})

export {router as showProdutoRouter};