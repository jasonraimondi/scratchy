import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class AppInfoResponse {
  @Field()
  name: string;
  @Field()
  version: string;
  @Field()
  author: string;
  @Field()
  license: string;
}
