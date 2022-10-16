import { BaseUserProvider } from "@lib/prisma";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserProvider extends BaseUserProvider {}
