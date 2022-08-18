import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { createNotificationDTO } from 'src/dtos/createNotification.dto';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  constructor(private notificationService: NotificationService) {}

  @UseGuards(JwtAuthGuard)
  @Post('createNotification')
  public createNotification(@Body() data: createNotificationDTO) {
    return this.notificationService.createNotification(data);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getNonOpenedNotifications/:id')
  public getNonOpenedNotifications(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.getNonOpenedNotifications(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getNotificationsUpdate/:userID/:after')
  public getNotificationsUpdate(
    @Param('userID', ParseIntPipe) userID: number,
    @Param('after') after: string,
  ) {
    return this.notificationService.getNotificationsUpdate(
      userID,
      new Date(after),
    );
  }

  @Get('all')
  public getAll() {
    return this.notificationService.getAll();
  }

  @UseGuards(JwtAuthGuard)
  @Put('setNotificationToOpened/:id')
  public setNotificationToOpened(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.setNotificationToOpened(id);
  }
}
