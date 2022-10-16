import { User } from "~/entities/user.entity";
import { BaseUserToken, UserTokenConstructor } from "@lib/prisma";
import { Field } from "@nestjs/graphql";

export abstract class UserTokenEntity extends BaseUserToken {
  @Field(() => User, { nullable: true })
  user!: null | User;

  constructor(props: UserTokenConstructor) {
    props.user = props.user ? new User(props.user) : undefined;
    super(props);
  }
}
