import { MailerService } from "@nestjs-modules/mailer";
import type { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";
import { Process, Processor } from "@nestjs/bull";
import { Inject, Logger } from "@nestjs/common";
import { Job } from "bull";

import { QUEUE, QUEUE_JOBS, REPOSITORY } from "~/lib/config/keys";
import { EmailTemplateService } from "~/lib/emails/services/email_template.service";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Processor(QUEUE.email)
export class SendEmailProcessor {
  private readonly logger = new Logger(SendEmailProcessor.name);

  constructor(
    @Inject(REPOSITORY.UserRepository) private readonly userRepository: IUserRepository,
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  @Process({ name: QUEUE_JOBS.email.send, concurrency: 2 })
  async handleSend(job: Job<ISendMailOptions>) {
    const { template, context, ...config } = job.data;
    if (!template) throw new Error(`Template not found ${template}`);
    await job.progress(5);
    const html = await this.emailTemplateService.html(template, context);
    const text = await this.emailTemplateService.txt(template, context);
    await job.progress(25);
    await this.mailerService.sendMail({ ...config, html, text });
    await job.progress(100);
    return;
  }
}
