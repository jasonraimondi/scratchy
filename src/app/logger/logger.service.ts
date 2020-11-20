import { Injectable, Logger, Scope } from "@nestjs/common";

// transient injects in a new copy into each dependency, instead of singleton di
@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends Logger {}
