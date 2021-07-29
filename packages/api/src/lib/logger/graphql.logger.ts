import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class GraphqlLogger extends Logger {
  constructor() {
    super();
    this.debug(this.constructor.name);
  }
  info(message: any, context?: string) {
    return this.log(message, context);
  }
}
