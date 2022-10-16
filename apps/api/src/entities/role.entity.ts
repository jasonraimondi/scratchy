import { ObjectType } from "@nestjs/graphql";
import { BaseRole, BaseUserRole } from "@lib/prisma";

@ObjectType()
export class Role extends BaseRole {}

@ObjectType()
export class UserRole extends BaseUserRole {}
