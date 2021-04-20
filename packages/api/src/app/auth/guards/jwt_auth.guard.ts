import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { GqlExecutionContext } from "@nestjs/graphql";
import type { FastifyRequest } from "fastify";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {}

@Injectable()
export class JwtAuthGqlGuard extends JwtAuthGuard {
  getRequest(context: ExecutionContext): FastifyRequest {
    console.log("getting context");
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
