import request from 'supertest';
import mongoose from 'mongoose';
import {app} from '../../app';



it('returns a 404 if the ticket is not found', async ()=>{
    const id = new mongoose.Types.ObjectId().toHexString();

  await request(app).get(`/api/produtos/${id}`).send().expect(404);

});


it('returns a  if the ticket is found', async ()=>{
    const title = 'extrato de tomate';
    const price = 2;
    const img = 'extrato_tomate.jpg';
    const category= 'codimento';

   const response =  await request(app)
    .post('/api/produtos')
    .set('Cookie', global.signin())
    .send({
        title,
        price,
        img,
        category
    }).expect(201);

    const ticketResponse = await request(app)
     .get(`/api/produtos/${response.body.id}`)
     .send()
     .expect(200);

     expect(ticketResponse.body.title).toEqual(title);
     expect(ticketResponse.body.price).toEqual(price);
     expect(ticketResponse.body.img).toEqual(img);
     expect(ticketResponse.body.category).toEqual(category);
})