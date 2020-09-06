import { Module } from "@nestjs/common";
import { EmailModule } from "~/lib/emails/email.module";
import { QueueModule } from "~/lib/queue/queue.module";
import { SendEmailProcessor } from "~/lib/queue/workers/send_email.processor";
import { RepositoryModule } from "~/lib/repositories/repository.module";

@Module({
  imports: [QueueModule, RepositoryModule, EmailModule],
  providers: [SendEmailProcessor],
})
export class WorkerModule {}
