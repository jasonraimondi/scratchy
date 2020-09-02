import { Arg, Query, Resolver } from "type-graphql";
import { Inject } from "@nestjs/common";

import { User } from "~/entity/user/user_entity";
import { REPOSITORY } from "~/lib/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";

@Resolver()
export class UserResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  async user(@Arg("email") email: string) {
    return await this.userRepository.findByEmail(email);
  }

  @Query(() => [User])
  users() {
    return this.userRepository.find();
  }
}
