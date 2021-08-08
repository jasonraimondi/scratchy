import { Field, ID, ObjectType } from "@nestjs/graphql";
import { FileUpload as FileUploadModel } from "@prisma/client";

import { User, UserModel } from "~/entities/user.entity";
import { v4 } from "uuid";

export { FileUploadModel };

type Relations = {
  user: UserModel;
};

@ObjectType()
export class FileUpload implements FileUploadModel {
  constructor({ user, ...entity }: FileUploadModel & Partial<Relations>) {
    this.id = entity.id;
    this.originalName = entity.originalName;
    this.userId = entity.userId;
    this.createdAt = entity.createdAt;
    if (user) this.user = new User(user);
  }

  @Field(() => ID)
  id: string;

  @Field()
  originalName: string;

  @Field()
  userId: string;

  @Field(() =>  User)
  user: User | null = null;

  @Field()
  createdAt: Date;

  static async create(createFile: CreateFileUpload): Promise<FileUpload> {
    return new FileUpload({
      id: createFile.id ?? v4(),
      originalName: createFile.originalName,
      userId: createFile.userId,
      createdAt: new Date(),
    });
  }
}

type CreateFileUpload = Omit<FileUploadModel,  "createdAt"|"id"> & { id?: string; };
