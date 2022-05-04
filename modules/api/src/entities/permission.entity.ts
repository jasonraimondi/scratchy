import { ObjectType } from "@nestjs/graphql";
import { BasePermission } from "@modules/prisma/models";

@ObjectType()
export class Permission extends BasePermission {}
