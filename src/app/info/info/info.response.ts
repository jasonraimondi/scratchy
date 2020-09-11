import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class InfoResponse {
  @Field()
  name: string;
  @Field()
  version: string;
  @Field()
  author: string;
  @Field()
  license: string;
}
