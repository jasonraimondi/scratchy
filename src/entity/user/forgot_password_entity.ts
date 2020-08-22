import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { v4 } from "uuid";

import { User } from "~/entity/user/user_entity";

@ObjectType()
@Entity()
export class ForgotPassword {
  private readonly oneDay = 60 * 60 * 24 * 1 * 1000; // 1 day

  constructor(user?: User, uuid?: string) {
    this.uuid = uuid ?? v4();
    if (user) this.user = user;
    this.expiresAt = new Date(Date.now() + this.oneDay);
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  uuid: string;

  @Field(() => User)
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Field()
  @Column()
  expiresAt: Date;
}
