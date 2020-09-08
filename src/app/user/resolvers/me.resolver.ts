import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";

import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { JwtAuthGqlGuard } from "~/lib/guards/jwt_auth.gql-guard";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class MeResolver {
  private readonly logger = new Logger(MeResolver.name);

  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@Context() { req }: MyContext) {
    this.logger.debug(req.user);
    return req.user;
  }
}
