import request from 'supertest';
import {app} from '../../app';


const createProduto = ()=>{
    return request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
        title: 'tomates',
        price: 2,
        category: 'Hort frut',
        img: 'tomato.jpeg'
    });
};

it('can fetch a product list', async ()=>{
   await createProduto();
   await createProduto();
   await createProduto();

   const response = await request(app)
   .get('/api/produtos')
   .send()
   .expect(200);

   expect(response.body.length).toEqual(3);
});
it('', async ()=>{})
it('', async ()=>{})