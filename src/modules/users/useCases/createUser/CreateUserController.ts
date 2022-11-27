import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async execute(request: Request, response: Response) {
    const { name, email, password } = request.body;
    console.log("cocontroller 1");

    const createUser = container.resolve(CreateUserUseCase);
     
    console.log("cocontroller 2");
    await createUser.execute({
      name,
      email,
      password
    });

    return response.status(201).send();
  }
}