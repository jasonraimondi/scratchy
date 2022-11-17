import { Job, Worker } from "bullmq";

import { EMAIL_QUEUE_NAME } from "$lib/queues/email_queue";
import { Env } from "$config/env";
import { emailService, SendInput } from "$lib/queue_workers/email_service";
import { logger } from "$lib/utils/logger";

const emailWorker = new Worker(
  EMAIL_QUEUE_NAME,
  (job: Job<SendInput>) => {
    return emailService.send(job.data);
  },
  {
    connection: Env.QUEUE_CONNECTION,
  },
);

emailWorker.on("completed", job => {
  logger.info(`emailWorker: ${job.id} has completed!`);
});

emailWorker.on("failed", (job, err) => {
  logger.info(`emailWorker: ${job.id} has failed with ${err.message}`);
});
