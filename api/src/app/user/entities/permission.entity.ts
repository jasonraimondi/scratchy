import { Field, ID, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Permission {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;
}
