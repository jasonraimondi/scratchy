import { Field, ObjectType } from "@nestjs/graphql";
import { BaseFileUpload, FileUploadConstructor } from "@lib/prisma";
import { ENV } from "~/config/environment";
import { User } from "~/entities/user.entity";

@ObjectType()
export class FileUpload extends BaseFileUpload {
  @Field(() => User, { nullable: true })
  user!: null | User;

  constructor(props: FileUploadConstructor) {
    props.user = props.user ? new User(props.user) : undefined;
    super(props);
  }

  @Field(() => String!)
  get url(): string {
    return `${ENV.s3.endpoint}/${ENV.s3.bucket}${this.path}`;
  }
}
