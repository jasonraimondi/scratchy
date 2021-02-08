import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { User } from "~/app/user/entities/user.entity";

import { ContextUser } from "~/lib/graphql/context_user.decorator";
import { LoggerService } from "~/lib/logger/logger.service";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";

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
