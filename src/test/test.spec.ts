//const request = require('supertest');
//const { validate, v4 } = require('uuid');
//import request from "supertest";
//import 'jest';
//import { app } from '../app';
import request from "supertest";
import { app } from "../app";

describe('Todos', () => {

  it("should be able to list all user's todo", async () => {
   jest.useFakeTimers();
    expect(2).toBe(2);
   
   const r = await request(app)
      .post('/api/v1/users')
      .send({
        name:"Bruno",
        email:"z",
        password:"ssss"
      });
   
    console.log(r.body);
   // const todoDate = new Date();
 
});
});