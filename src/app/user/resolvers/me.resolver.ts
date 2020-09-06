import { Inject } from "@nestjs/common";
import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";

import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/lib/config/keys";
import { isAuth } from "~/lib/middlewares/auth/is_auth";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/lib/config/my_context";

@Resolver()
export class MeResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { auth }: MyContext) {
    return await this.userRepository.findById(auth!.userId);
  }
}
