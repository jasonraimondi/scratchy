import { v4 } from "uuid";
import { UserProvider as UserProviderModel, Provider } from "@prisma/client";

import { User, UserModel } from "./user.entity";
import { EntityConstructor } from "~/entities/_entity";

type Relations = {
  user?: UserModel;
};

export class UserProvider implements UserProviderModel {
  readonly id: string;
  readonly provider: Provider;
  readonly userId: string;
  readonly user?: UserModel;

  constructor(entity: EntityConstructor<UserProviderModel, Relations, "provider" | "userId">) {
    this.id = entity.id ?? v4();
    this.provider = entity.provider;
    this.userId = entity.userId;
    this.user = entity.user && new User(entity.user);
  }

  toEntity(): UserProviderModel {
    const { user, ...entity } = this;
    return entity;
  }
}
