import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Role } from "~/entity/role/role.entity";

@ObjectType()
@Entity("permissions")
export class Permission {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @ManyToMany(() => Role)
  @JoinTable({ name: "role_permissions" })
  roles: Role[];
}
