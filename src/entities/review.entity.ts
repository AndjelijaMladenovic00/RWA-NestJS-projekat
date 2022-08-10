import { User } from './user.entity';
import { Article } from './article.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.reviews)
  public user!: User;

  @ManyToOne(() => Article, (article) => article.reviews)
  public article!: Article;

  @Column({ type: 'int', nullable: false })
  public score!: number;

  @Column({ type: 'text', nullable: false })
  public comment!: string;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public reviewedOn!: Date;
}
