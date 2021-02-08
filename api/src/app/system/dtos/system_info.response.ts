import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class SystemInfoResponse {
  @Field()
  name: string;
  @Field()
  version: string;
  @Field()
  author: string;
  @Field()
  license: string;
}
