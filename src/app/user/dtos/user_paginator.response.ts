import { Field, ObjectType } from "@nestjs/graphql";
import { PagingResult } from "typeorm-cursor-pagination";

import { User } from "~/app/user/entities/user.entity";
import { Cursor } from "~/lib/database/dtos/cursor.response";

@ObjectType()
export class UserPaginatorResponse implements PagingResult<User> {
  @Field(() => Cursor)
  cursor: Cursor;

  @Field(() => [User])
  data: User[];
}
