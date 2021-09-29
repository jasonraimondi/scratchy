import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FileUpload as FileUploadModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { v4 } from "uuid";
import { EntityConstructor } from "~/entities/_entity";

export { FileUploadModel };

type Relations = {
  user?: UserModel;
};

@ObjectType()
export class FileUpload implements FileUploadModel {
  constructor(entity: EntityConstructor<FileUploadModel, Relations, "originalName" | "userId">) {
    this.id = entity.id ?? v4();
    this.originalName = entity.originalName;
    this.createdAt = entity.createdAt ?? new Date();
    this.userId = entity.userId;
    this.user = entity.user && new User(entity.user);
  }

  @Field(() => ID!)
  id: string;

  @Field()
  originalName: string;

  @Field()
  userId: string;

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  createdAt: Date;
}
