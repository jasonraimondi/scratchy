import { v4 } from "uuid";

import { prisma } from "$db";
import { prismaUserCreate } from "$db/user";
import { prismaGuardAgainstDuplicateUsers } from "$lib/services/user";
import { RegisterSchemaWithIP } from "$trpc/routers/register";
import { createUser } from "$entities/user";
import { createEmailConfirmationToken } from "$entities/user_token";

export namespace RegisterService {
  export async function register(input: RegisterSchemaWithIP) {
    input.id = input.id ?? v4();

    await prismaGuardAgainstDuplicateUsers(input.id, input.email);

    const user = await createUser(input);

    const emailConfirmation = createEmailConfirmationToken(user.id);

    await prisma.$transaction([
      prismaUserCreate(user),
      prisma.userToken.create({ data: emailConfirmation }),
    ]);
    return {
      emailConfirmation,
      user,
    };
  }
}
