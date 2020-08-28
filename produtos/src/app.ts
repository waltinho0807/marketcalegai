import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from 'cookie-session';
import{errorHandler, NotFoundError, currentUser} from '@marketcalegari/common';
import {createProdutoRouter} from './routes/new';
import {showProdutoRouter} from './routes/show';
import {indexProdutoRouter} from './routes/index';
import {updateProdutoRouter} from './routes/update';


 

const app = express();
app.set('trust proxy', true)
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test'
    })
);
app.use(currentUser);


app.use(createProdutoRouter);
app.use(showProdutoRouter);
app.use(indexProdutoRouter);
app.use(updateProdutoRouter);


app.all('*', (req, res)=>{
    throw new NotFoundError();
})

app.use(errorHandler);
export {app};