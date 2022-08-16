import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from 'src/auth/auth.service';
import { Article } from 'src/entities/article.entity';
import { Report } from 'src/entities/report.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([Article]),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [ReportController],
  providers: [ReportService, JwtService, AuthService, UsersService],
  exports: [ReportService],
})
export class ReportModule {}
