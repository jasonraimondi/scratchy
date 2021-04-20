import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class GraphqlLogger extends Logger {
  constructor() {
    super();
    this.setContext(this.constructor.name);
  }
  info(message: any, context?: string) {
    return this.log(message, context);
  }
}
