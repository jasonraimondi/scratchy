import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { v4 } from "uuid";
import { EmailConfirmationToken as EmailConfirmationTokenModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { ENV } from "~/config/environment";
import { EntityConstructor } from "~/entities/_entity";

export { EmailConfirmationTokenModel };

type Relations = {
  user: UserModel;
};

@ObjectType()
export class EmailConfirmationToken implements EmailConfirmationTokenModel {
  @Field(() => ID!)
  readonly id: string;

  @Field(() => User!)
  readonly user: User;

  @Field()
  @IsUUID()
  readonly userId: string;

  @Field()
  readonly expiresAt: Date;

  readonly createdAt: Date;

  constructor(entity: EntityConstructor<EmailConfirmationTokenModel, Relations, "userId">) {
    this.id = entity.id ?? v4();
    this.expiresAt = entity.expiresAt ?? new Date(Date.now() + ENV.ttl.emailConfirmationToken);
    this.createdAt = entity.createdAt ?? new Date();
    this.userId = entity.userId;
    this.user = new User(entity.user);
  }
}
