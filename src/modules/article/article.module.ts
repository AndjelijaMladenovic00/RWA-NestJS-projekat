import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { Notification } from 'src/entities/notification.entity';
import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([Review]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AuthService, JwtService, UsersService],
  exports: [ArticleService],
})
export class ArticleModule {}
