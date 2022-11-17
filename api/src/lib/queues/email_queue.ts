import { Queue } from "bullmq";
import { Env } from "$config/env";
import { SendInput } from "$lib/queue_workers/email_service";

export const EMAIL_QUEUE_NAME = "email_queue";

const emailQueue = new Queue(EMAIL_QUEUE_NAME, {
  connection: Env.QUEUE_CONNECTION,
});

export function queueEmail(input: SendInput) {
  return emailQueue.add("send", input);
}
