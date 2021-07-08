import { Field, ObjectType } from "@nestjs/graphql";

import { User } from "~/entities/user.entity";
import { PaginatorMeta } from "~/lib/database/dtos/responses/paginator.response";

@ObjectType()
export class UserPaginatorResponse {
  @Field(() => PaginatorMeta!)
  meta!: PaginatorMeta;

  @Field(() => [User]!)
  data!: User[];
}
