// eslint-disable-next-line prettier/prettier
import { User } from './user.entity';
import { Article } from './article.entity';
import { ReportStatus } from '../enums/report-status.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => User, (user) => user.reports)
  public user!: User;

  @ManyToOne(() => Article, (article) => article.reports)
  public article!: Article;

  @Column({
    type: 'timestamptz',
    nullable: false,
    default: () => 'CURRENT_TIMESTAMP',
  })
  public reportedOn!: Date;

  @Column({ type: 'text', default: ReportStatus.pending })
  public status!: ReportStatus;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  public resolvedOn: Date | null;
}
