import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Permission as PermissionModel } from "@prisma/client";

import { EntityConstructor } from "~/entities/_entity";

export { PermissionModel };

@ObjectType()
export class Permission implements PermissionModel {
  constructor(entity: EntityConstructor<PermissionModel, {}, "id" | "name">) {
    this.id = entity.id;
    this.name = entity.name;
  }

  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}
