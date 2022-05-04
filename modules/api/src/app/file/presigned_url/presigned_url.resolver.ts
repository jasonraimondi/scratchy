import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

import { AuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { PresignedUrl, PresignedUrlInput, PresignedUrlService } from "~/app/file/presigned_url/presigned_url.service";
import { CurrentUser } from "~/lib/decorators/context_user.decorator";
import { User } from "~/entities/user.entity";

@Resolver()
export class PresignedUrlResolver {
  constructor(private readonly service: PresignedUrlService) {}

  @Mutation(() => PresignedUrl!)
  @UseGuards(AuthGuard)
  async presignedUrl(@CurrentUser() user: User, @Args("input") input: PresignedUrlInput): Promise<PresignedUrl> {
    return this.service.create(user, input);
  }
}
