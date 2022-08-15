import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ReportService } from '../report/report.service';
import { ReviewService } from '../review/review.service';
import { UsersService } from '../users/users.service';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Article]),
    //TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Review]),
  ],
  controllers: [ArticleController],
  providers: [
    ArticleService,
    AuthService,
    JwtService,
    ReviewService,
    //ReportService,
    UsersService,
  ],
})
export class ArticleModule {}
