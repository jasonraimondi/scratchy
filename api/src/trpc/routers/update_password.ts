import { z } from "zod";
import { publicProcedure, router } from "$trpc/trpc";
import { prismaUserById, prismaUserUpdate } from "$db/user";
import { verifyUser } from "$entities/user";
import { hashPassword } from "$lib/utils/password";

export const PasswordSchema = z.string().min(8);

export const updatePasswordRouter = router({
  updatePassword: publicProcedure
    .input(
      z.object({
        userId: z.string().uuid(),
        currentPassword: PasswordSchema,
        password: PasswordSchema,
        revokeToken: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const user = await prismaUserById(input.userId);
      await verifyUser(user, input.currentPassword);
      user.passwordHash = await hashPassword(input.password);
      if (input.revokeToken) user.tokenVersion++;
      await prismaUserUpdate(user);
      return true;
    }),
});
