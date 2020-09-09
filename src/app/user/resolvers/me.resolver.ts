import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";
import { MyContext } from "~/config/my_context";

import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { ContextUser } from "~/lib/graphql/context_user.decorator";
import { JwtAuthGqlGuard } from "~/lib/guards/jwt_auth.gql-guard";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class MeResolver {
  private readonly logger = new Logger(MeResolver.name);

  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@ContextUser() user: User) {
    return this.userRepository.findByEmail(user.email);
  }
}
