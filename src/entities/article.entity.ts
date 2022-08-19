import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookGenre } from '../enums/book-genre.enum';
import { Notification } from './notification.entity';
import { Report } from './report.entity';
import { Review } from './review.entity';
import { User } from './user.entity';

@Entity()
export class Article {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.articles)
  public user!: User;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public publishedOn!: Date;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public lastEdited!: Date;

  @Column({ type: 'text', nullable: false })
  public text!: string;

  @Column({ type: 'text', nullable: false })
  public title!: string;

  @OneToMany(() => Review, (review) => review.article)
  public reviews: Review[];

  @OneToMany(() => Report, (report) => report.article)
  public reports: Report[];

  @Column({ type: 'double precision', nullable: true })
  public averageScore: number | null;

  @Column({ type: 'text' })
  public genre: BookGenre;

  @OneToMany(() => Notification, (notification) => notification.article)
  public notifications: Notification[];
}
