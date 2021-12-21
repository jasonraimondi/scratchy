import { MessageBody, SubscribeMessage, WebSocketGateway } from "@nestjs/websockets";

import { LoggerService } from "~/lib/logger/logger.service";
import { UserRepository } from "~/lib/database/repositories/user.repository";

@WebSocketGateway()
export class HeartbeatChannel {
  constructor(private readonly logger: LoggerService, private readonly userRepository: UserRepository) {}

  @SubscribeMessage("appear")
  async appear(@MessageBody("userId") userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    this.logger.log("appear");
    this.logger.log({ ...user });
  }

  @SubscribeMessage("away")
  async away(): Promise<void> {
    this.logger.log("away");
  }
}
