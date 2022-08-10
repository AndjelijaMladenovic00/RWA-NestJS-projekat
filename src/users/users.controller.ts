import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { createUserDTO } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get(':email')
  public getUser(@Param() email: string) {
    return this.userService.getUser(email);
  }

  @Post()
  public createUser(@Body() user: createUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }
}
