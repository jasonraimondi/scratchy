import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "~/entity/user/user_entity";
import { BaseUuidEntity } from "~/entity/uuid_entity";

@ObjectType()
@Entity("forgot_password_tokens")
export class ForgotPasswordToken extends BaseUuidEntity {
  private readonly oneDay = 60 * 60 * 24 * 1 * 1000; // 1 day

  constructor(user?: User, id?: string) {
    super(id);
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
