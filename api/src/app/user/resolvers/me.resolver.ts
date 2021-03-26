import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";
import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/lib/database/repositories/user.repository";
import { ContextUser } from "~/lib/graphql/context_user.decorator";
import { LoggerService } from "~/lib/logger/logger.service";

@Resolver()
export class MeResolver {
  constructor(private userRepository: UserRepo, private readonly logger: LoggerService) {
    this.logger.setContext(this.constructor.name);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@ContextUser() user: User) {
    return this.userRepository.findByEmail(user.email);
  }
}
