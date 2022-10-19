import { hash } from "bcryptjs";

import { PrismaClient } from "../src/generated/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

void (async function () {
  const passwordHash = await hash("password", 10);

  const overlordRole = await prisma.role.upsert({
    where: { name: "overlord" },
    update: {},
    create: { name: "overlord" },
  });

  const adminId = "dd74961a-c348-4471-98a5-19fc3c5b5079";
  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: { passwordHash },
    create: {
      id: adminId,
      email: "admin@example.com",
      nickname: "admin",
      createdIP: "127.0.0.1",
      passwordHash,
    },
  });

  const jasonId = "f42236b9-8aae-4dbc-b78a-e314a5ed6d22";
  const jason = await prisma.user.upsert({
    where: { id: jasonId },
    update: { passwordHash },
    create: {
      id: jasonId,
      email: "jason@raimondi.us",
      isEmailConfirmed: true,
      nickname: "Jason",
      createdIP: "127.0.0.1",
      passwordHash: passwordHash,
    },
  });

  const userRoles = [
    {
      userId: adminId,
      roleId: overlordRole.id,
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
