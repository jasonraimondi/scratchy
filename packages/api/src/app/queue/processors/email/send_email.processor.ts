import { MailerService } from "@nestjs-modules/mailer";
import type { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";
import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";

import { QUEUE, QUEUE_JOBS } from "~/config/queues";
import { EmailTemplateService } from "~/app/email/services/email_template.service";
import { LoggerService } from "~/lib/logger/logger.service";

@Processor(QUEUE.email)
export class SendEmailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Process({ name: QUEUE_JOBS.email.send, concurrency: 2 })
  async handleSend(job: Job<ISendMailOptions>) {
    const { template, context, ...config } = job.data;
    if (!template) throw new Error(`Template not found ${template}`);
    await job.progress(5);
    const html = this.emailTemplateService.html(template, context);
    const text = this.emailTemplateService.txt(template, context);
    await job.progress(25);
    await this.mailerService.sendMail({ ...config, html, text });
    await job.progress(100);
    return;
  }
}
