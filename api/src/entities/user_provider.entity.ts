import { BaseUserProvider } from "~/generated/entities";
import { ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserProvider extends BaseUserProvider {}
