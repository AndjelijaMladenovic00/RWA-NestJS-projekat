import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { Article } from 'src/entities/article.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Notification]),
    TypeOrmModule.forFeature([Article]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, JwtService, AuthService, UsersService],
  exports: [NotificationService],
})
export class NotificationModule {}
