import { UseGuards } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";

import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";
import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { LoggerService } from "~/lib/logger/logger.service";
import { MyContext } from "~/lib/graphql/my_context";

@Resolver()
export class MeResolver {
  constructor(private userRepository: UserRepository, private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@Context() ctx: MyContext) {
    const user = ctx.req.user;
    this.logger.debug(user.email)
    return this.userRepository.findByEmail(user.email);
  }
}
