import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.usersService.getUser(username);

    if (user && user.password == password) return user;
    else return null;
  }

  async login(user: User) {
    const payload = {
      username: user.username,
      id: user.id,
      profileType: user.profileType,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.SECRET,
      }),
      username: user.username,
      profileType: user.profileType,
      id: user.id,
    };
  }
}
