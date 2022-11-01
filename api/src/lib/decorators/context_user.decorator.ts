import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";

import { User } from "~/entities/user.entity";
import { MyContext } from "~/config/graphql";

export const CurrentUserREST = createParamDecorator((_data: unknown, ctx: ExecutionContext): User | undefined => {
  return ctx.switchToHttp().getRequest().raw.user as User | undefined;
});

export const CurrentUser = createParamDecorator((_data: unknown, ctx: ExecutionContext) => {
  const gqlCtx = GqlExecutionContext.create(ctx);
  return gqlCtx.getContext<MyContext>().user;
});
