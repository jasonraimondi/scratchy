import type { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";
import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bullmq";

import { QUEUE } from "~/config/queues";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";
import { Processor, WorkerHost } from "@nestjs/bullmq";

@Processor(QUEUE.email)
export class SendEmailProcessor extends WorkerHost {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {
    super();
  }

  async process(job: Job<ISendMailOptions>) {
    const { template, context, ...config } = job.data;
    if (!template) throw new Error(`Template not found ${template}`);
    const { html, text } = this.emailTemplateService.both(template, context);
    await job.updateProgress(98);
    await this.mailerService.sendMail({ ...config, html, text });
    await job.updateProgress(100);
    return;
  }
}
