const request = require('supertest');
const app = require('../index');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const { addUser, deleteAllusers } = require('./helper');

describe('events', () => {
  const event = {
    title: 'Testing',
    body: 'this is a test',
    price: 20,
    date: Date.now(),
    place: 'here',
    capacity: 400,
    category: 'Marketing',
    organization: 'Edem',
    time: '20:00',
    timeEnd: '22:00',
    modality: 'Presencial',
    speaker: 'J.L',
  };

  beforeAll(() => addUser('testing2@test.com', 'test1234'));

  afterAll(async () => {
    await Event.deleteMany({});
    await deleteAllusers();
    await app.server.close();
    await mongoose.disconnect();
  });

  let token;

  test('Login a user', async () => {
    const res = await request(app)
      .post('/users/loginuser')
      .send({ email: 'testing2@test.com', password: 'test1234' })
      .expect(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });

  test('Create a event', async () => {
    const res = await request(app)
      .post('/events/create')
      .send(event)
      .set({ Authorization: token })
      .expect(201);

    expect(res.body.event._id).toBeDefined();
    expect(res.body.event.userId).toBeDefined();
  });
});
