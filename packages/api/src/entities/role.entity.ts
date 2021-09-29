import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Role as RoleModel } from "@prisma/client";

import { Permission, PermissionModel } from "~/entities/permission.entity";

export { RoleModel };

type Relations = {
  permissions: PermissionModel[];
};

@ObjectType()
export class Role implements RoleModel {
  constructor(entity: RoleModel & Partial<Relations>) {
    this.id = entity.id;
    this.name = entity.name;
    this.permissions = entity.permissions?.map((p) => new Permission(p)) ?? [];
  }

  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  permissions: Permission[] | null;
}
