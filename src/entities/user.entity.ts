import { profileType } from '../enums/profile-type.enum';
import { Review } from './review.entity';
import { Report } from './report.entity';
import { Article } from './article.entity';
import { Notification } from './notification.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ type: 'text', nullable: false, unique: true })
  public username!: string;

  @Column({ type: 'text', nullable: false, unique: true })
  public email!: string;

  @Column({ type: 'text', nullable: false })
  public password!: string;

  @Column({ type: 'text', nullable: false, default: profileType.user })
  public profileType!: string;

  @OneToMany(() => Article, (article) => article.user)
  public articles: Article[];

  @OneToMany(() => Review, (review) => review.user)
  public reviews: Review[];

  @OneToMany(() => Report, (report) => report.user)
  public reports: Report[];

  @OneToMany(() => Notification, (notification) => notification.user)
  public notifications: Notification[];
}
