import { Controller } from "@nestjs/common";
import type { ISendMailOptions } from "@nestjs-modules/mailer/dist/interfaces/send-mail-options.interface";
import { Ctx, EventPattern, Payload, Transport } from "@nestjs/microservices";
import { MailerService } from "@nestjs-modules/mailer";
import { Job } from "bullmq";

import { QUEUE } from "~/config/queues";
import { EmailTemplateService } from "~/lib/email/services/email_template.service";

@Controller()
export class SendEmailProcessor {
  constructor(
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
  ) {}

  @EventPattern(QUEUE.email, Transport.REDIS)
  async handleSend(@Payload() data: ISendMailOptions, @Ctx() job: Job) {
    const { template, context, ...config } = data;
    if (!template) throw new Error(`Template not found ${template}`);
    const { html, text } = this.emailTemplateService.both(template, context);
    await job.updateProgress(98);
    await this.mailerService.sendMail({ ...config, html, text });
    await job.updateProgress(100);
    return;
  }
}
