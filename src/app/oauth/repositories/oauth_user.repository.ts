import { GrantIdentifier, OAuthUserRepository } from "@jmondi/oauth2-server";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "~/app/oauth/entities/client.entity";
import { UnauthorizedException } from "~/entity/user/exceptions/unauthorized.exception";
import { User } from "~/entity/user/user.entity";

import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class OAuthUserRepo extends UserRepo implements OAuthUserRepository {
  constructor(@InjectRepository(User) repository: Repository<User>) {
    super(repository);
  }

  getUserByCredentials(
    identifier: string,
    password?: string,
    grantType?: GrantIdentifier,
    client?: Client,
  ): Promise<User | undefined> {
    // @todo validate
    console.log({ password, grantType });
    if (grantType === "password" && !password) {
      throw UnauthorizedException.invalidUser();
    }
    return this.findById(identifier);
  }

  async extraAccessTokenFields(user: User) {
    return {
      email: user.email,
      isActive: user.isActive,
    };
  }
}
