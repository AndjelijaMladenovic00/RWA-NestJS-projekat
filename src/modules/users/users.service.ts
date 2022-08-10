import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { createUserDTO } from 'src/dtos/createUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  public async getUser(email: string) {
    return await this.userRepository.find({ where: { email: email } });
  }

  public async createUser(user: createUserDTO): Promise<User> {
    const { username, password, email } = user;

    if (!username || !password || !email)
      throw new Error('Not all parameters are provided for creating an user!');

    const userCheck: User[] = await this.userRepository.find({
      where: { email: email },
    });

    if (userCheck.length != 0)
      throw new Error('User with set email already exists!');

    const newUser: User = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
