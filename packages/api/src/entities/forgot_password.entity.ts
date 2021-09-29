import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { v4 } from "uuid";
import { ForgotPasswordToken as ForgotPasswordTokenModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { ENV } from "~/config/environments";
import { EntityConstructor } from "~/entities/_entity";

type Relations = {
  user: UserModel;
};

export { ForgotPasswordTokenModel };

@ObjectType()
export class ForgotPasswordToken implements ForgotPasswordTokenModel {
  @Field(() => ID)
  id: string;

  @Field(() => String!)
  @IsUUID()
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  readonly expiresAt: Date;

  readonly createdAt: Date;

  constructor(entity: EntityConstructor<ForgotPasswordTokenModel, Relations, "userId">) {
    this.id = entity.id ?? v4();
    this.expiresAt = entity.expiresAt ?? new Date(Date.now() + ENV.tokenTTLs.forgotPasswordToken);
    this.createdAt = entity.createdAt ?? new Date();
    this.userId = entity.userId;
    this.user = new User(entity.user);
  }

  toEntity(): ForgotPasswordTokenModel {
    const { user, ...entity } = this;
    return entity;
  }
}
