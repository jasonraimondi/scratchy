import { Field, ObjectType } from "@nestjs/graphql";
import { Cursor as PagingCursor } from "typeorm-cursor-pagination";

@ObjectType()
export class Cursor implements PagingCursor {
  @Field(() => String!, { nullable: true })
  beforeCursor: string | null;

  @Field(() => String!, { nullable: true })
  afterCursor: string | null;
}
