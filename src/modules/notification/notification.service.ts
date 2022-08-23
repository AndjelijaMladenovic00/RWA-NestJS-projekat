import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createNotificationDTO } from 'src/dtos/createNotification.dto';
import { Article } from 'src/entities/article.entity';
import { Notification } from 'src/entities/notification.entity';
import { User } from 'src/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Article) private articleRepository: Repository<Article>,
  ) {}

  public async createNotification(data: createNotificationDTO) {
    const user: User = await this.userRepository.findOneBy({ id: data.userID });
    const article: Article = await this.articleRepository.findOneBy({
      id: data.articleID,
    });
    const notificationData = {
      user: user,
      sentOn: new Date(),
      opened: false,
      title: data.title,
      message: data.message,
      article: article,
      deleteArticleOnReception: data.deleteArticleOnReception,
      corelatingArticleID: article.id,
    };
    const notification = await this.notificationRepository.create(
      notificationData,
    );
    return this.notificationRepository.save(notification);
  }

  public async getNonOpenedNotifications(userID: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: userID },
      relations: { notifications: true },
    });
    if (!user.notifications || user.notifications.length == 0) return [];
    else {
      const data = user.notifications
        .filter((notification: Notification) => {
          return !notification.opened;
        })
        .sort((a: Notification, b: Notification) => {
          if (a.sentOn > b.sentOn) return -1;
          else if (a.sentOn < b.sentOn) return 1;
          else return 0;
        })
        .map((notification: Notification) => {
          return {
            id: notification.id,
            userID: userID,
            title: notification.title,
            message: notification.message,
            sentOn: notification.sentOn,
            opened: notification.opened,
            articleID: notification.corelatingArticleID,
            deleteArticleOnReception: notification.deleteArticleOnReception,
            senderID: notification.corelatingUserID,
          };
        });

      return data;
    }
  }

  public async getNotificationsUpdate(userID: number, after: Date) {
    const user: User = await this.userRepository.findOne({
      where: { id: userID },
      relations: { notifications: true },
    });
    if (!user || !user.notifications || user.notifications.length == 0)
      return [];
    else {
      const data = user.notifications
        .filter((notification: Notification) => {
          return !notification.opened && notification.sentOn > after;
        })
        .sort((a: Notification, b: Notification) => {
          if (a.sentOn > b.sentOn) return -1;
          else if (a.sentOn < b.sentOn) return 1;
          else return 0;
        })
        .map((notification: Notification) => {
          return {
            id: notification.id,
            userID: userID,
            title: notification.title,
            message: notification.message,
            sentOn: notification.sentOn,
            opened: notification.opened,
            articleID: notification.corelatingArticleID,
            deleteArticleOnReception: notification.deleteArticleOnReception,
            senderID: notification.corelatingUserID,
          };
        });

      return data;
    }
  }

  public setNotificationToOpened(id: number) {
    return this.notificationRepository.update({ id: id }, { opened: true });
  }
}
