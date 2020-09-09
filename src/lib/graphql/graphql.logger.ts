import { Logger } from "@nestjs/common";

export class GraphqlLogger extends Logger {
  info(message: any, context?: string) {
    return this.log(message, context);
  }
}
