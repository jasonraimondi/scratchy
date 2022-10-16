import { ObjectType } from "@nestjs/graphql";
import { BasePermission } from "@lib/prisma";

@ObjectType()
export class Permission extends BasePermission {}
