import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/local-auth.guard';
import { createUserDTO } from 'src/dtos/createUser.dto';
import { User } from 'src/entities/user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  public createUser(@Body() user: createUserDTO): Promise<User> {
    return this.userService.createUser(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('loginWithToken')
  public async loginWithToken(username: string) {
    const user: User = await this.userService.getUser(username);
    return this.authService.login(user);
  }
}
