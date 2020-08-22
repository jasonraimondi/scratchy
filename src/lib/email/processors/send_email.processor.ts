import { Processor, Process } from "@nestjs/bull";
import { Inject, Logger } from "@nestjs/common";
import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bull";

import { QUEUE, QUEUE_JOBS, REPOSITORY } from "~/config/inversify";
import { IUserRepository } from "~/lib/repository/user/user.repository";
import { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";

@Processor(QUEUE.email)
export class SendEmailProcessor {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private readonly userRepository: IUserRepository,
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  @Process(QUEUE_JOBS.email.send)
  async handleSend(job: Job<ISendMailOptions>) {
    const { template, context, ...config } = job.data;
    if (!template) throw new Error(`Template not found ${template}`);
    const html = await this.emailTemplateService.html(template, context);
    const text = await this.emailTemplateService.txt(template, context);
    try {
      const result = await this.mailerService.sendMail({
        ...config,
        html,
        text,
      });
      this.logger.debug(result);
    } catch (error) {
      this.logger.error(error);
    }
    await job.finished();
  }
}
