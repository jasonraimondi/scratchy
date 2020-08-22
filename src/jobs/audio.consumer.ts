import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from "@nestjs/common";

@Processor('audio')
export class AudioConsumer {
  private readonly logger = new Logger(AudioConsumer.name);

  @Process('transcode')
  async transcode(job: Job<unknown>) {
    this.logger.debug("start");
    this.logger.debug(job.data);
    await sleep(500);
    this.logger.debug("start");
    return {};
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}