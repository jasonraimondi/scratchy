import { Field, ID, ObjectType } from "type-graphql";
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from "typeorm";
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
