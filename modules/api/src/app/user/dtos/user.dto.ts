import { Field, ObjectType } from "@nestjs/graphql";
import { PaginatorResponse } from "@modules/prisma/models";

import { User } from "~/entities/user.entity";

@ObjectType()
export class UserPaginatorResponse extends PaginatorResponse<User> {
  @Field(() => [User!]!)
  data!: User[];
}
