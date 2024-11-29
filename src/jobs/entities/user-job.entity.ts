import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { Job } from './job.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
  underscored: true,
})
export class UserJob extends Model<UserJob> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Job)
  @Column({ allowNull: false })
  jobId: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  userId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @BelongsTo(() => User, 'userId')
  user: User;

  @BelongsTo(() => Job, 'jobId')
  job: Job;
}
