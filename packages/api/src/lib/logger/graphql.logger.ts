import { ConsoleLogger, Injectable } from "@nestjs/common";

@Injectable()
export class GraphqlLogger extends ConsoleLogger {
  info(message: any) {
    return this.log(message, this.constructor.name);
  }
}
