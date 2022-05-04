import { ObjectType } from "@nestjs/graphql";
import { BaseRole, BaseUserRole } from "@modules/prisma/models";

@ObjectType()
export class Role extends BaseRole {}

@ObjectType()
export class UserRole extends BaseUserRole {}
