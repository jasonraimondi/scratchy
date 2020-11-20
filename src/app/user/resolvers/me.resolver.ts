import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { User } from "~/app/user/entities/user.entity";

import { ContextUser } from "~/lib/graphql/context_user.decorator";
import { JwtAuthGqlGuard } from "~/lib/guards/jwt_auth.gql-guard";
import { LoggerService } from "~/app/logger/logger.service";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

@Resolver()
export class MeResolver {
  constructor(private userRepository: UserRepo, private readonly logger: LoggerService) {
    logger.setContext(MeResolver.name);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@ContextUser() user: User) {
    return this.userRepository.findByEmail(user.email);
  }
}
