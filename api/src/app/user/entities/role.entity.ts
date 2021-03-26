import { Field, ID, ObjectType } from "@nestjs/graphql";

import { Permission } from "~/app/user/entities/permission.entity";

@ObjectType()
export class Role {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  permissions: Permission[] | null;
}
