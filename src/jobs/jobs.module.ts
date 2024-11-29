import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { Job } from './entities/job.entity';
import { SequelizeModule } from '@nestjs/sequelize';
import { JobsService } from './jobs.service';
import { UserJobsService } from './user-job.service';
import { UserModule } from 'src/user/user.module';
import { UserJob } from './entities/user-job.entity';

@Module({
  imports: [SequelizeModule.forFeature([Job, UserJob]), UserModule],
  controllers: [JobsController],
  providers: [JobsService, UserJobsService],
})
export class JobsModule {}
