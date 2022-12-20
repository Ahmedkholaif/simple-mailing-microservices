import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Status } from '../dto/create-mail-status.dto';

@Entity()
export class MailStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column()
  email: string;

  @Column()
  totalCount: number;

  @Column({default:0})
  sentCount: number;

  @Column({default: Status.New})
  status: string;

  @Column({default: new Date().toUTCString()})
  createdAt: string;

  @Column({default: new Date().toUTCString()})
  updatedAt: string;
}
