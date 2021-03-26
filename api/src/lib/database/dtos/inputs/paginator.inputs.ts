import { IsOptional, Max, Min } from "class-validator";
import { Field, InputType, Int } from "@nestjs/graphql";
import { Prisma } from "@prisma/client";

@InputType()
export abstract class PaginatorInputs {
  @IsOptional()
  @Min(0)
  @Field(() => Int, { nullable: true })
  skip?: number;

  @IsOptional()
  @Min(0)
  @Max(500)
  @Field(() => Int, { nullable: true })
  take?: number;
}

@InputType()
export class UserPaginatorInputs extends PaginatorInputs {
  cursor?: Prisma.UserWhereUniqueInput;
  where?: Prisma.UserWhereInput;
  orderBy?: Prisma.UserOrderByInput;
}
