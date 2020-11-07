import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { Column, Entity, Index, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { User } from "~/app/user/entities/user.entity";

@ObjectType()
@Entity("forgot_password_tokens")
export class ForgotPasswordToken {
  private readonly oneDay = 60 * 60 * 24 * 1 * 1000; // 1 day

  constructor(user?: User, id = v4()) {
    this.id = id;
    if (user) this.user = user;
    this.expiresAt = new Date(Date.now() + this.oneDay);
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => User)
  @OneToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "userId" })
  user: User;

  @Field()
  @Index()
  @Column("uuid")
  @IsUUID()
  userId: string;

  @Field()
  @Column()
  expiresAt: Date;
}
