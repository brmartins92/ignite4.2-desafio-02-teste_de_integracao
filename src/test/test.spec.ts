
//const { validate, v4 as uuidv4 } = require('uuid');
import { v4 as uuidv4 } from 'uuid';
import request from "supertest";
import { Connection } from 'typeorm'
import createConnection from '../database'

import { app } from "../app";

let connection: Connection

describe('Todos', () => {

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  const user = {
    name: "Brunao",
    email: `br${uuidv4()}@gmail.com`,
    password: "ssss"
  }

  it("should be able to create User and return 201", async () => {
    const r = await request(app)
      .post('/api/v1/users')
      .send(user);

    expect(r.status).toBe(201);
  });

  it("should be not able to create user that already exist and return 400 ", async () => {

    const r = await request(app)
      .post('/api/v1/users')
      .send({
        email: user.email,
        password: user.password
      });

    expect(r.status).toBe(400);
  });

  it("should be able to received user and token jwt ", async () => {

    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });
    console.log(r);
    expect(r.status).toBe(200);
    expect(r.body).toHaveProperty("token");
    expect(r.body).toHaveProperty("user");
  });

  it("should be able to send jwt and received user ", async () => {
    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = `Bearer ${r.body.token}`;

    const profileCreated = await request(app)
      .get('/api/v1/profile')
      .set({ 'Authorization': token }
      );

    expect(profileCreated.status).toBe(200);
    expect(profileCreated.body).toHaveProperty("name");
    expect(profileCreated.body).toHaveProperty("email");
    expect(profileCreated.body).toHaveProperty("id");

  });

  it("should be able to send amount to deposit  ", async () => {
    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = `Bearer ${r.body.token}`;

    const depositCreated = await request(app)
      .post('/api/v1/statements/deposit')
      .set({ 'Authorization': token })
      .send({
        amount: 500,
        description: "deposit"
      });

    expect(depositCreated.status).toBe(201);
    expect(depositCreated.body).toHaveProperty("user_id");
    expect(depositCreated.body).toHaveProperty("description");
    expect(depositCreated.body).toHaveProperty("type");

  });

  it("should be able to send amount to withdraw  ", async () => {
    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = `Bearer ${r.body.token}`;

    const depositCreated = await request(app)
      .post('/api/v1/statements/deposit')
      .set({ 'Authorization': token })
      .send({
        amount: 900,
        description: "deposit"
      });

    const withdrawCreated = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({ 'Authorization': token })
      .send({
        amount: 900,
        description: "withdraw"
      });

    expect(withdrawCreated.status).toBe(201);
    expect(withdrawCreated.body).toHaveProperty("user_id");
    expect(withdrawCreated.body).toHaveProperty("description");
    expect(withdrawCreated.body).toHaveProperty("type");

  });

  it("should be able to show balance", async () => {
    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = `Bearer ${r.body.token}`;

    const depositCreated = await request(app)
      .post('/api/v1/statements/deposit')
      .set({ 'Authorization': token })
      .send({
        amount: 800,
        description: "deposit"
      });

    const withdrawCreated = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({ 'Authorization': token })
      .send({
        amount: 100,
        description: "withdraw"
      });

    const balanceCreated = await request(app)
      .get(`/api/v1/statements/balance`)
      .set({ 'Authorization': token }
      );

    expect(balanceCreated.status).toBe(200);
    expect(balanceCreated.body).toHaveProperty("statement");

  });

  it("should be able to all operations  ", async () => {
    const r = await request(app)
      .post('/api/v1/sessions')
      .send({
        email: user.email,
        password: user.password
      });

    const token = `Bearer ${r.body.token}`;

    const depositCreated = await request(app)
      .post('/api/v1/statements/deposit')
      .set({ 'Authorization': token })
      .send({
        amount: 900,
        description: "deposit"
      });

    const withdrawCreated = await request(app)
      .post('/api/v1/statements/withdraw')
      .set({ 'Authorization': token })
      .send({
        amount: 900,
        description: "withdraw"
      });


    const statementsCreated = await request(app)
      .get(`/api/v1/statements/${withdrawCreated.body.id}`)
      .set({ 'Authorization': token }
      );

    expect(statementsCreated.status).toBe(200);

    expect(withdrawCreated.body).toHaveProperty("user_id");
    expect(withdrawCreated.body).toHaveProperty("amount");
    expect(withdrawCreated.body).toHaveProperty("description");
    expect(withdrawCreated.body).toHaveProperty("type");

  });

});
