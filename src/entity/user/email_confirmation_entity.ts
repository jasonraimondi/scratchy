import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
import { Field, ID, ObjectType } from "type-graphql";
import { User } from "~/entity/user/user_entity";
import { v4 } from "uuid";

@ObjectType()
@Entity()
export class EmailConfirmation {
  private readonly sevenDays = 60 * 60 * 24 * 7 * 1000; // 1 day

  constructor(user: User, uuid?: string) {
    this.uuid = uuid ?? v4();
    this.user = user;
    this.expiresAt = new Date(Date.now() + this.sevenDays);
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
