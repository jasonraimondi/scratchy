import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Role as RoleModel } from "@prisma/client";

import { Permission } from "~/app/user/entities/permission.entity";

export { RoleModel };

type Relations = {
  permissions: [];
};

@ObjectType()
export class Role implements RoleModel {
  constructor({ permissions, ...entity }: RoleModel & Partial<Relations>) {
    Object.assign(this, entity);
    this.permissions = permissions?.map((p) => new Permission(p)) ?? [];
  }

  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  permissions: Permission[] | null;
}
