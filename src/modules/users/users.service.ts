import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { createUserDTO } from 'src/dtos/createUser.dto';
import { Article } from 'src/entities/article.entity';
import { Notification } from 'src/entities/notification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  public getUser(username: string) {
    return this.userRepository.findOneBy({ username: username });
  }

  public async createUser(user: createUserDTO) {
    const { username, password, email } = user;

    if (!username || !password || !email)
      throw new Error('Not all parameters are provided for creating an user!');

    const userCheck1: User[] = await this.userRepository.find({
      where: { email: email },
    });

    if (userCheck1.length != 0)
      throw new Error('User with set email already exists!');

    const userCheck2: User[] = await this.userRepository.find({
      where: { username: username },
    });

    if (userCheck2.length != 0)
      throw new Error('User with set username already exists!');

    const newUser: User = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  public async getProfileData(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: { articles: true },
    });

    if (!user) return {};

    let i = 0;
    let sum = 0;

    if (user.articles) {
      user.articles.forEach((article: Article) => {
        if (article.averageScore) {
          i++;
          sum += article.averageScore;
        }
      });
    }

    let averageScore: number;

    if (i == 0) averageScore = 0;
    else {
      averageScore = Math.round((sum / i) * 100) / 100;
    }

    if (user.articles) i = user.articles.length;
    else i = 0;

    return {
      username: user.username,
      userId: user.id,
      numberOfArticles: i,
      averageArticleScore: averageScore,
    };
  }

  public async getSubscriptionsForUser(id: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: { subscriptions: true },
    });

    if (!user || !user.subscriptions) return [];
    else
      return user.subscriptions.map((user: User) => {
        return {
          id: user.id,
          username: user.username,
          email: user.email,
          profileType: user.profileType,
        };
      });
  }

  public async getSubscribersForUser(id: number) {
    const subscribers: User[] = (
      await this.userRepository.find({ relations: { subscriptions: true } })
    ).filter((subscription: User) => {
      subscription.subscriptions.forEach((sub: User) => {
        if (sub.id == id) return true;
      });
      return false;
    });

    return subscribers;
  }

  public async subscribe(userID: number, subscribingToID: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: userID },
      relations: { subscriptions: true },
    });

    if (!user) return;

    const subscription: User = await this.userRepository.findOneBy({
      id: subscribingToID,
    });

    if (!subscription) return;

    if (!user.subscriptions.includes(subscription))
      user.subscriptions.push(subscription);

    const notificationData = {
      user: subscription,
      title: `New subscritpion by user ${user.username}`,
      message: `User ${user.username} just subscribed to you! Check out ${user.username} profile!`,
      corelatingUserID: user.id,
    };

    const notification: Notification =
      this.notificationRepository.create(notificationData);
    await this.notificationRepository.save(notification);

    await this.userRepository.save(user);

    return subscription;
  }

  public async unsubscribe(userID: number, unsubscribingFromID: number) {
    const user: User = await this.userRepository.findOne({
      where: { id: userID },
      relations: { subscriptions: true },
    });

    if (!user) return;

    const subscription: User = await this.userRepository.findOneBy({
      id: unsubscribingFromID,
    });

    if (!subscription) return;

    user.subscriptions = user.subscriptions.filter((subscription: User) => {
      subscription.id != unsubscribingFromID;
    });

    await this.userRepository.save(user);

    return subscription;
  }
}
