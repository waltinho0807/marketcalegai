import nats from 'node-nats-streaming';
import {ProdutoCreatedPublisher} from './events/produto-created-publisher';

console.clear();

const stan = nats.connect('market', 'abc', {
  url: 'http://localhost:4222',
});

stan.on('connect', async () => {
  console.log('Publisher connected to NATS');
   
  const publisher = new ProdutoCreatedPublisher(stan);
  
  try {
    await publisher.publish({
      id: '123',
      title: 'tomat',
      price: 2,
      img: 'sdsf.jpg',
      category: 'massa'
  })
  } catch (error) {
    console.log(error);
  }
  
});
