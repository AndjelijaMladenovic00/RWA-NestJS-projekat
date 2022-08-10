import { Article } from 'src/entities/article.entity';
import { Notification } from 'src/entities/notification.entity';
import { Report } from 'src/entities/report.entity';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ConnectionOptions } from 'typeorm';

export const typeOrmConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'mysecretpassword',
  entities: [User, Article, Notification, Review, Report],
  synchronize: true,
};
