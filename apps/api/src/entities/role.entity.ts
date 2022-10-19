import { Field, ObjectType } from "@nestjs/graphql";
import { BaseRole, BaseUserRole, UserRoleConstructor } from "@lib/prisma";
import { User } from "~/entities/user.entity";

@ObjectType()
export class Role extends BaseRole {}

@ObjectType()
export class UserRole extends BaseUserRole {
  @Field(() => User, { nullable: true })
  user!: null | User;

  @Field(() => Role, { nullable: true })
  role!: null | Role;

  constructor(props: UserRoleConstructor) {
    props.user = props.user ? new User(props.user) : null;
    props.role = props.role ? new Role(props.role) : null;
    super(props);
  }
}
