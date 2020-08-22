import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { inject, injectable } from "inversify";

import { isAuth } from "~/lib/middleware/is_auth";
import { User } from "~/entity/user/user_entity";
import { MyContext } from "~/lib/types/my_context";
import { REPOSITORY } from "~/lib/constants/inversify";
import { IUserRepository } from "~/lib/repository/user/user_repository";

@injectable()
@Resolver()
export class MeResolver {
  constructor(
    @inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
  ) {}

  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { auth }: MyContext) {
    return await this.userRepository.findById(auth!.userId);
  }
}
