import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class GraphqlLogger extends Logger {
  info(message: any, context?: string) {
    return this.log(message, context);
  }
}
