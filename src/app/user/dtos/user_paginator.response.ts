import { Field, ObjectType } from "@nestjs/graphql";
import { PagingResult } from "typeorm-cursor-pagination";

import { User } from "~/entity/user/user.entity";
import { Cursor } from "~/lib/repositories/dtos/cursor.response";

@ObjectType()
export class UserPaginatorResponse implements PagingResult<User> {
  @Field(() => Cursor)
  cursor: Cursor;

  @Field(() => [User])
  data: User[];
}
