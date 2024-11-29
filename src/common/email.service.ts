import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  constructor(private readonly mailService: MailerService) {}

  async sendMail(
    body: string,
    recruiterEmail: string,
    jobTitle: string,
    candidateEmail: string,
  ) {
    await this.mailService.sendMail({
      from: recruiterEmail,
      to: candidateEmail,
      subject: `Job Application Received: ${jobTitle}`,
      text: body,
    });
  }
}
