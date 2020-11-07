import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Column, Entity, Index, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

import { Permission } from "~/app/user/entities/permission.entity";

@ObjectType()
@Entity("roles")
export class Role {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Index({ unique: true })
  @Column()
  name: string;

  @ManyToMany(() => Permission)
  @JoinTable({ name: "role_permissions" })
  permissions: Permission[];
}
