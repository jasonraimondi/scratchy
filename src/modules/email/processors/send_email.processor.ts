import { Processor, Process } from "@nestjs/bull";
import { Inject, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bull";

import { QUEUE, QUEUE_JOBS, REPOSITORY } from "~/lib/constants/inversify";
import { IUserRepository } from "~/modules/repository/user/user.repository";
import { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";

@Processor(QUEUE.email)
export class SendEmailProcessor {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private readonly userRepository: IUserRepository,
    private readonly mailerService: MailerService,
  ) {}

  @Process(QUEUE_JOBS.email.send)
  async handleSend(job: Job<ISendMailOptions>) {
    this.logger.debug(job.data);
    const res = await this.mailerService.sendMail(job.data);
    this.logger.debug(res);
  }
}
