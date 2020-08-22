import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { Inject, Logger } from "@nestjs/common";
import { REPOSITORY } from "~/lib/constants/inversify";
import { IUserRepository } from "~/lib/repository/user/user.repository";

@Processor('audio')
export class AudioConsumer {
  private readonly logger = new Logger(AudioConsumer.name);

  constructor(@Inject(REPOSITORY.UserRepository) private readonly userRepository: IUserRepository) {
  }

  @Process('transcode')
  async transcode(job: Job<unknown>) {
    this.logger.debug("start");
    this.logger.debug(job.data);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const user = await this.userRepository.findById(job.data.userId).catch(this.logger.error);
    await sleep(500);
    this.logger.debug(user);
    this.logger.debug("FIN");
    return {};
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}