import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class Address {
  @Field({ nullable: true })
  name?: string;

  @Field()
  address1: string;

  @Field({ nullable: true })
  address2?: string;

  @Field()
  city: string;

  @Field()
  state: string;

  @Field()
  zip: string;
}
