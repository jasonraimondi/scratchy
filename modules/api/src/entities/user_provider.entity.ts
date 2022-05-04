import { BaseUserProvider } from "@modules/prisma/models";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserProvider extends BaseUserProvider {}
