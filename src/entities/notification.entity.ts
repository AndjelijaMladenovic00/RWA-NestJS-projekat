import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
}
