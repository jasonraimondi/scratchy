import { Job } from "bull";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";

import { SendEmailProcessor } from "~/app/queue-workers/processors/email/send_email.processor";
import { QUEUE, QUEUE_JOBS } from "~/config/queues";
import { EmailTemplateService } from "~/app/emails/services/email_template.service";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { LoggerService } from "~/lib/logger/logger.service";

@Processor(QUEUE.image)
export class ImageProcessor {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  @Process({ name: QUEUE_JOBS.image.send, concurrency: 2 })
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
