import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Article } from './article.entity';
import { User } from './user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.notifications)
  public user!: User;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public sentOn!: Date;

  @Column({ type: 'boolean', nullable: false, default: false })
  public opened!: boolean;

  @Column({ type: 'text', nullable: false })
  public message!: string;

  @Column({ type: 'text', nullable: false })
  public title!: string;

  @ManyToOne(() => Article, (article) => article.notifications)
  public article: Article;

  @Column({ type: 'integer', nullable: true })
  public corelatingArticleID: number;

  @Column({ type: 'boolean', nullable: true })
  public deleteArticleOnReception: boolean;

  @Column({ type: 'integer', nullable: true })
  public corelatingUserID: number;
}
