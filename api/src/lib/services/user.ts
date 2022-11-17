import { prisma } from "~/lib/repository";

export async function prismaGuardAgainstDuplicateUsers(id: string, email: string): Promise<void> {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          email: {
            equals: email,
            mode: "insensitive",
          },
        },
        { id },
      ],
    },
  });
  if (Boolean(user)) throw new Error("duplicate users");
}
