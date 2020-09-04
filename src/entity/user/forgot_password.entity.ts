import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { User } from "~/entity/user/user.entity";

@ObjectType()
@Entity("forgot_password_tokens")
export class ForgotPasswordToken {
  private readonly oneDay = 60 * 60 * 24 * 1 * 1000; // 1 day

  constructor(user?: User, id?: string) {
    this.id = id ?? v4();
    if (user) this.user = user;
    this.expiresAt = new Date(Date.now() + this.oneDay);
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  expiresAt: Date;
}
