import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ArticleService } from '../article/article.service';
import { UsersService } from '../users/users.service';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ReviewController],
  providers: [
    ReviewService,
    AuthService,
    JwtService,
    ArticleService,
    UsersService,
  ],
})
export class ReviewModule {}
