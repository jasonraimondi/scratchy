import { Field, InputType } from "type-graphql";
import { Order, PagingQuery } from "typeorm-cursor-pagination";
import { IsIn } from "class-validator";

@InputType()
export class PaginatorInputs implements PagingQuery {
  @Field(() => String, { nullable: true })
  afterCursor?: string;

  @Field(() => String, { nullable: true })
  beforeCursor?: string;

  @Field(() => Number, { nullable: true })
  limit?: number;

  @Field(() => String, { nullable: true })
  @IsIn(["ASC", "DESC"])
  order?: Order;
}
