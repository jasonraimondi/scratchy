import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Inject } from "@nestjs/common";

import { isAuth } from "~/lib/middlewares/is_auth";
import { User } from "~/entity/user/user_entity";
import { MyContext } from "~/lib/types/my_context";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class MeResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { auth }: MyContext) {
    return await this.userRepository.findById(auth!.userId);
  }
}
