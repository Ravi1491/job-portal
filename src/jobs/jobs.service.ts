import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { Job } from './entities/job.entity';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job)
    private jobModel: typeof Job,
  ) {}

  create(createUserInput: CreateJobDto) {
    return this.jobModel.create(createUserInput);
  }

  findOne(payload = {}, options = {}) {
    return this.jobModel.findOne({
      where: payload,
      ...options,
    });
  }

  findAll(payload = {}, options = {}) {
    return this.jobModel.findAll({
      where: payload,
      ...options,
    });
  }
}
