import { ObjectType } from "@nestjs/graphql";
import { BasePermission } from "~/generated/entities";

@ObjectType()
export class Permission extends BasePermission {}
