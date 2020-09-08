import { Inject } from "@nestjs/common";
import { Args, Query, Resolver } from "@nestjs/graphql";

import { UserPaginatorResponse } from "~/app/user/dtos/user_paginator.response";
import { User } from "~/entity/user/user.entity";
import { REPOSITORY } from "~/config/keys";
import { IUserRepository } from "~/lib/repositories/user/user.repository";
import { PaginatorInputs } from "~/lib/repositories/dtos/paginator.inputs";

@Resolver()
export class UserResolver {
  constructor(@Inject(REPOSITORY.UserRepository) private userRepository: IUserRepository) {}

  @Query(() => User)
  async user(@Args("email") email: string) {
    return await this.userRepository.findByEmail(email);
  }

  @Query(() => UserPaginatorResponse)
  users(@Args("query", { nullable: true }) query?: PaginatorInputs) {
    return this.userRepository.list(query);
  }
}
