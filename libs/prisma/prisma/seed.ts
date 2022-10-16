import { PrismaClient } from "../src/generated/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const adminId = "dd74961a-c348-4471-98a5-19fc3c5b5079";

void (async function () {
  const passwordHash = await hash("Password123!", 10);

  const overlord = await prisma.role.upsert({
    where: { name: "overlord" },
    update: {},
    create: { name: "overlord" },
  });

  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: { passwordHash },
    create: {
      id: adminId,
      email: "admin@raimondi.us",
      nickname: "admin",
      createdIP: "127.0.0.1",
      passwordHash,
    },
  });

  const userRoles = [
    {
      userId: adminId,
      roleId: overlord.id,
    },
    {
      userId: jasonId,
      roleId: overlord.id,
    },
  ];

  for (const userRole of userRoles) {
    await prisma.userRole.upsert({
      where: { userId_roleId: userRole },
      update: {},
      create: userRole,
    });
  }
})();
