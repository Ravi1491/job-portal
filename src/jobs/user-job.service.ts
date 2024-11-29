import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { UserJob } from './entities/user-job.entity';

@Injectable()
export class UserJobsService {
  constructor(
    @InjectModel(UserJob)
    private userJobModel: typeof UserJob,
  ) {}

  create(createUserJobInput: { userId: string; jobId: string }) {
    return this.userJobModel.create(createUserJobInput);
  }

  findOne(payload = {}, options = {}) {
    return this.userJobModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.userJobModel.findAll({
      where: payload,
      ...options,
    });
  }
}
