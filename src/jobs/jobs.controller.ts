import {
  Controller,
  Get,
  Post,
  Body,
  HttpException,
  HttpStatus,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UserJobsService } from './user-job.service';
import { CurrentUser } from 'src/auth/decorators/current-user';
import { User } from 'src/user/entities/user.entity';
import { UserRole } from 'src/utils/enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles';
import { Job } from './entities/job.entity';
import { EmailService } from 'src/common/email.service';

@Controller('job')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly userJobService: UserJobsService,
    private readonly emailService: EmailService,
  ) {}

  @Roles(UserRole.RECRUITER)
  @UseGuards(RolesGuard)
  @Post('/recuriter/create')
  create(@Body() createJobDto: CreateJobDto, @CurrentUser() CurrentUser: User) {
    try {
      return this.jobsService.create({
        ...createJobDto,
        recruiterId: CurrentUser.id,
      });
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.RECRUITER)
  @UseGuards(RolesGuard)
  @Get('/recuriter/all-applications')
  async getJobApplications(@Query('jobId') jobId: string) {
    try {
      const appliedUsers = await this.userJobService.findAll(
        {
          jobId,
        },
        {
          include: [{ model: User }],
        },
      );

      return appliedUsers.map((userJob) => userJob.user);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.CANDIDATE)
  @UseGuards(RolesGuard)
  @Post('/candidate/apply')
  async applyForJob(
    @Body() payload: { jobId: string },
    @CurrentUser() currentUser: User,
  ) {
    try {
      if (currentUser.role !== UserRole.CANDIDATE) {
        throw new Error('Only Candidate can apply');
      }

      const job = await this.jobsService.findOne({ id: payload.jobId });

      if (!job) {
        throw new Error('Job not found');
      }

      const existingJobApplied = await this.userJobService.findOne({
        userId: currentUser.id,
        jobId: payload.jobId,
      });

      if (existingJobApplied) {
        throw new Error('You have already applied for this job');
      }

      await this.userJobService.create({
        jobId: payload.jobId,
        userId: currentUser.id,
      });

      // Send Email to candidate
      await this.emailService.sendMail(
        `You have successfully applied for the job: ${job.title}`,
        'sqaure@gmail.com',
        job.title,
        currentUser.email,
      );

      return 'Job Applied Successfully';
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Roles(UserRole.CANDIDATE)
  @UseGuards(RolesGuard)
  @Get('/candidate/applied-jobs')
  async getAppliedJobs(@CurrentUser() currentUser: User) {
    try {
      const appliedJobs = await this.userJobService.findAll(
        {
          userId: currentUser.id,
        },
        {
          include: [{ model: Job }],
        },
      );

      return appliedJobs.map((userJob) => userJob.job);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
