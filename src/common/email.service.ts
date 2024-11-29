import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMailToCandidate({
    body,
    recruiterEmail,
    jobTitle,
    candidateEmail,
  }: {
    body: string;
    recruiterEmail: string;
    jobTitle: string;
    candidateEmail: string;
  }) {
    await this.mailService.sendMail({
      from: recruiterEmail,
      to: candidateEmail,
      subject: `Job Application Received: ${jobTitle}`,
      text: body,
    });
  }

  async sendMailToRecruiter({
    body,
    recruiterEmail,
    jobTitle,
  }: {
    body: string;
    recruiterEmail: string;
    jobTitle: string;
  }) {
    await this.mailService.sendMail({
      from: 'sqaureboat@gmail.com',
      to: recruiterEmail,
      subject: `You have received a new application for ${jobTitle}`,
      text: body,
    });
  }
}
