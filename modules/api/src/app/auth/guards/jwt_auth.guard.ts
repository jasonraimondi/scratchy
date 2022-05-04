import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { FastifyRequest } from "fastify";

import { User } from "~/entities/user.entity";
import { LoggerService } from "~/lib/logger/logger.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(protected readonly logger: LoggerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = this.getRequest(context);
    // @ts-ignore
    let user: User | undefined = req.user ?? req.raw.user;
    console.log({ user });
    return !!user;
  }

  getRequest(context: ExecutionContext): FastifyRequest {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }

  static getTokenFromBearerString(request: FastifyRequest): string | undefined {
    const auth = request.headers["authorization"];
    const [type, code] = auth?.split(" ") ?? [];
    if (type?.toLowerCase() !== "bearer") return undefined;
    return code;
  }
}

@Injectable()
export class AuthGuardREST extends AuthGuard {
  getRequest(context: ExecutionContext): FastifyRequest {
    return context.switchToHttp().getRequest<FastifyRequest>();
  }
}

export function getTokenFromBearerString(request: FastifyRequest): string | undefined {
  const auth = request.headers["authorization"];
  const [type, code] = auth?.split(" ") ?? [];
  if (type?.toLowerCase() !== "bearer") return undefined;
  return code;
}
