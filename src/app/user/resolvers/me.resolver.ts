import { Inject, Logger, UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { ContextUser } from "~/lib/graphql/context_user.decorator";
import { JwtAuthGqlGuard } from "~/lib/guards/jwt_auth.gql-guard";
import { LoggerService } from "~/lib/logger/logger.service";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class MeResolver {
  constructor(
    @Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(MeResolver.name);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@ContextUser() user: User) {
    return this.userRepository.findByEmail(user.email);
  }
}
