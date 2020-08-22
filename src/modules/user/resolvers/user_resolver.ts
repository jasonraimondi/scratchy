import { Arg, Query, Resolver } from "type-graphql";
import { inject, injectable } from "inversify";

import { User } from "~/entity/user/user_entity";
import { IUserRepository } from "~/lib/repository/user/user_repository";
import { REPOSITORY } from "~/lib/constants/inversify";

@injectable()
@Resolver()
export class UserResolver {
  constructor(
    @inject(REPOSITORY.UserRepository) private userRepository: IUserRepository,
  ) {}

  @Query(() => User)
  async user(@Arg("id") id: string) {
    return await this.userRepository.findById(id);
  }

  @Query(() => [User])
  users() {
    return this.userRepository.find();
  }
}
