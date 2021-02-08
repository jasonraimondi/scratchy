import { IsOptional, Max, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";

export interface PagingQuery {
  afterCursor?: string;
  beforeCursor?: string;
  limit?: number;
  order?: Order;
}

@InputType()
export class PaginatorInputs implements PagingQuery {
  @Field(() => String, { nullable: true })
  afterCursor?: string;

  @Field(() => String, { nullable: true })
  beforeCursor?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @Min(0)
  @Max(500)
  limit?: number;

  @Field(() => Order, { nullable: true })
  order?: Order;
}

export enum Order {
  ASC = "ASC",
  DESC = "DESC",
}
