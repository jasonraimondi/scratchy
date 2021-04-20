import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class PaginatorMeta {
  @Field(() => String!, { nullable: true })
  previousLink: string | null;

  @Field(() => String!, { nullable: true })
  nextLink: string | null;
}
