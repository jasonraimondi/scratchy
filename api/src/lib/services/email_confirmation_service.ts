import { prisma } from "$db";
import { prismaUserByEmail } from "$db/user";
import { prismaUserTokenById } from "$db/user_token";
import { AuthService } from "$lib/services/auth/auth_service";

export namespace EmailConfirmationService {
  export async function verify(input: { email: string; token: string; ipAddr: string }) {
    const confirmation = await prismaUserTokenById(input.token);
    if (confirmation.user.email.toLowerCase() !== input.email.toLowerCase()) {
      throw new Error(
        `invalid user and confirmation (${confirmation.user.email}) (${input.email})`,
      );
    }
    await prisma.$transaction([
      prisma.user.update({
        where: { id: confirmation.userId },
        data: { isEmailConfirmed: true },
      }),
      prisma.userToken.delete({ where: { id: confirmation.id } }),
    ]);
    const user = await prismaUserByEmail(input.email);
    return await AuthService.login({
      user,
      ipAddr: input.ipAddr,
    });
  }
}
