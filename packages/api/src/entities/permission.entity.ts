import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Permission as PermissionModel } from "@prisma/client";

export { PermissionModel };

@ObjectType()
export class Permission implements PermissionModel {
  constructor(entity: PermissionModel) {
    this.id = entity.id;
    this.name = entity.name;
  }

  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}
