import { Args, Query, Resolver } from "@nestjs/graphql";

import { UserPaginatorResponse } from "~/app/user/dtos/user_paginator.response";
import { User } from "~/entity/user/user.entity";
import { UserRepo } from "~/lib/repositories/user/user.repository";
import { PaginatorInputs } from "~/lib/repositories/dtos/paginator.inputs";

@Resolver()
export class UserResolver {
  constructor(private userRepository: UserRepo) {}

  @Query(() => User)
  async user(@Args("email") email: string) {
    return await this.userRepository.findByEmail(email);
  }

  @Query(() => UserPaginatorResponse)
  users(@Args("query", { nullable: true }) query?: PaginatorInputs) {
    return this.userRepository.list(query);
  }
}
