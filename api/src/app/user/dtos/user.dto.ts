import { Field, ObjectType } from "@nestjs/graphql";
import { PaginatorResponse } from "~/generated/entities";

import { User } from "~/entities/user.entity";

@ObjectType()
export class UserPaginatorResponse extends PaginatorResponse<User> {
  @Field(() => [User!]!)
  data!: User[];
}
