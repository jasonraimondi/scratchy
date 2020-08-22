import { Arg, Query, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";

import { User } from "~/entity/user/user_entity";
import { REPOSITORY } from "~/config/inversify";
import { IUserRepository } from "~/lib/repository/user/user.repository";

@Resolver()
export class UserResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  async user(@Arg("id") id: string) {
    return await this.userRepository.findById(id);
  }

  @Query(() => [User])
  users() {
    return this.userRepository.find();
  }
}
