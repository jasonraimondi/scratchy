import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";

import { User } from "~/entity/user/user.entity";
import { BaseUuidEntity } from "~/entity/uuid.entity";

@ObjectType()
@Entity("email_confirmation_tokens")
export class EmailConfirmationToken extends BaseUuidEntity {
  private readonly sevenDays = 60 * 60 * 24 * 7 * 1000; // 1 day

  constructor(user: User, id?: string) {
    super(id);
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
