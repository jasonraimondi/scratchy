import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";

import { JwtAuthGqlGuard } from "~/app/auth/guards/jwt_auth.guard";
import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { ContextUser } from "~/lib/decorators/context_user.decorator";

@Resolver()
export class MeResolver {
  constructor(private userRepository: UserRepository) {}

  @Query(() => User)
  @UseGuards(JwtAuthGqlGuard)
  me(@ContextUser() user: User) {
    return this.userRepository.findByEmail(user.email);
  }
}
