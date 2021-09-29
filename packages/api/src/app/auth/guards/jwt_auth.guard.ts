import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { FastifyRequest } from "fastify";

import { LoggerService } from "~/lib/logger/logger.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(protected readonly logger: LoggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = this.getRequest(context);
    this.logger.log(`THIS IS THE GUARD USER ${request.user}`);
    // if the user exists
    return !!request.user;
  }

  getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }

  static getTokenFromBearerString(request: FastifyRequest): string | undefined {
    const auth = request.headers["authorization"];
    const [type, code] = auth?.split(" ") ?? [];
    if (type?.toLowerCase() !== "bearer") return undefined;
    return code;
  }
}

@Injectable()
export class JwtAuthGqlGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext): FastifyRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
