import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ArticleController],
  providers: [ArticleService, AuthService, JwtService, UsersService],
})
export class ArticleModule {}
