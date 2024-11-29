import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  DeletedAt,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UserJob } from './user-job.entity';
import { User } from 'src/user/entities/user.entity';

@Table({
  underscored: true,
})
export class Job extends Model<Job> {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false })
  description: string;

  @ForeignKey(() => User)
  @Column({ allowNull: false })
  recruiterId: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  @DeletedAt
  deletedAt: Date;

  @HasMany(() => UserJob)
  userJobs: UserJob[];

  @BelongsTo(() => User, 'recruiterId')
  user: User;
}
