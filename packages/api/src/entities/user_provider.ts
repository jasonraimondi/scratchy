import { UserProvider as UserProviderModel, Provider } from "@prisma/client";

import { UserModel } from "./user.entity";

type Relations = {
  user: UserModel;
};

export class UserProvider implements UserProviderModel {
  readonly id: string;
  readonly provider: Provider;
  readonly userId: string;
  readonly user?: UserModel;

  constructor({ user, ...entity }: UserProviderModel & Partial<Relations>) {
    this.id = entity.id;
    this.provider = entity.provider;
    this.userId = entity.userId;
  }

  toEntity(): UserProviderModel {
    const { user, ...entity } = this;
    return entity;
  }
}
