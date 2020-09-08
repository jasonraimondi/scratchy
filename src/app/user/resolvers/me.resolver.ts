import { Inject } from "@nestjs/common";
import { Context, Query, Resolver } from "@nestjs/graphql";

import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
// import { isAuth } from "~/lib/middlewares/auth/is_auth";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { MyContext } from "~/config/my_context";

@Resolver()
export class MeResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  // @UseMiddleware(isAuth)
  async me(@Context() { auth }: MyContext) {
    return await this.userRepository.findById(auth!.userId);
  }
}
