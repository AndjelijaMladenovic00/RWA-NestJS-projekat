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
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Review]),
    TypeOrmModule.forFeature([Notification]),
  ],
  controllers: [ReportController],
  providers: [ReportService, JwtService, AuthService, UsersService],
  exports: [ReportService],
})
export class ReportModule {}
