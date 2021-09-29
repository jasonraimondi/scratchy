import "reflect-metadata";
import "source-map-support/register";
import "tsconfig-paths/register";
import "dotenv/config";

import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/utils/password";
import { generateUser } from "../test/generators/generateUser";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function main() {
  const passwordHash = await hashPassword("jasonraimondi");

  await prisma.role.upsert({
    where: { name: "overlord" },
    update: {},
    create: { name: "overlord" },
  })

  for (const _ of new Array(20)) {
    const u = await generateUser();
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u.toEntity(),
    });
  }

  await prisma.user.upsert({
    where: { email: "jason@raimondi.us" },
    update: { passwordHash },
    create: {
      id: "4ba51f0d-3301-484d-b702-655db0e67e62",
      firstName: "Jason",
      lastName: "Raimondi",
      email: "jason@raimondi.us",
      isEmailConfirmed: true,
      createdIP: "127.0.0.1",
      passwordHash,
      roles: {
        create: [
          {
            role: {
              connectOrCreate: {
                where: { name: "overlord" },
                create: { name: "overlord" }
              }
            }
          }
        ]
      }
    }
  });
}

void (async function () {
  try {
    await main();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
})().finally(async () => {
  await prisma.$disconnect();
});
