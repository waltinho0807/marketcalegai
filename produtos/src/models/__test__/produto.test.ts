import { Produto } from '../produto';

it('implements optimistic concurrency control', async (done) => {
  // Create an instance of a ticket
  const produto = Produto.build({
    title: 'concert',
    price: 5,
    img: 'ffsdf.jpg',
    category: 'dfdfdfgdfg',
    userId: '123',
  });

  // Save the ticket to the database
  await produto.save();

  // fetch the ticket twice
  const firstInstance = await Produto.findById(produto.id);
  const secondInstance = await Produto.findById(produto.id);

  // make two separate changes to the tickets we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched ticket
  await firstInstance!.save();

  // save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return done();
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
    const produto = Produto.build({
      title: 'concert',
      price: 20,
      img: 'dfdfg.jpg',
      category: 'sdddfdf',
      userId: '123',
    });
  
    await produto.save();
    expect(produto.version).toEqual(0);
    await produto.save();
    expect(produto.version).toEqual(1);
    await produto.save();
    expect(produto.version).toEqual(2);
  });
  
