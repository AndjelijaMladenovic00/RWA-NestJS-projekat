import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { ReviewModule } from './modules/review/review.module';
import { ArticleModule } from './modules/article/article.module';
import { ReportModule } from './modules/report/report.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmConfigService } from 'typeOrmConfig.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    UsersModule,
    ReviewModule,
    ArticleModule,
    ReportModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
