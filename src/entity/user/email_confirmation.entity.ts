import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { User } from "~/entity/user/user.entity";

@ObjectType()
@Entity("email_confirmation_tokens")
export class EmailConfirmationToken {
  private readonly sevenDays = 60 * 60 * 24 * 7 * 1000; // 1 day

  constructor(user: User, id?: string) {
    this.id = id ?? v4();
    this.user = user;
    this.expiresAt = new Date(Date.now() + this.sevenDays);
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
