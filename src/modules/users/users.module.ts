import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Notification } from 'src/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtService, AuthService],
  exports: [UsersService],
})
export class UsersModule {}
