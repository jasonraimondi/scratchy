import { Job } from "bull";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Process, Processor } from "@nestjs/bull";

import { SendEmailProcessor } from "~/app/queue-workers/processors/email/send_email.processor";
import { QUEUE, QUEUE_JOBS } from "~/config/queues";
import { EmailTemplateService } from "~/app/emails/services/email_template.service";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { LoggerService } from "~/app/logger/logger.service";

@Processor(QUEUE.image)
export class ImageProcessor {
  constructor(
    private readonly userRepository: UserRepo,
    private readonly mailerService: MailerService,
    private readonly emailTemplateService: EmailTemplateService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(SendEmailProcessor.name);
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
