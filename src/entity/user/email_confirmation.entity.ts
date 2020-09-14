import { Field, ID, ObjectType } from "@nestjs/graphql";
import { IsUUID } from "class-validator";
import { Column, Entity, Index, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { v4 } from "uuid";

import { User } from "~/entity/user/user.entity";

@ObjectType()
@Entity("email_confirmation_tokens")
export class EmailConfirmationToken {
  private readonly sevenDays = 60 * 60 * 24 * 7 * 1000; // 1 day

  constructor(user: User, id?: string) {
    this.id = id ?? v4();
    this.userId = user?.id;
    this.user = user;
    this.expiresAt = new Date(Date.now() + this.sevenDays);
  }

  @Field(() => ID)
  @PrimaryColumn("uuid")
  id: string;

  @Field(() => User)
  @OneToOne(() => User)
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
