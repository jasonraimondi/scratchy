import { BookStatus, ChapterStatus, PrismaClient } from "../generated/client";
import {
  rand,
  randCatchPhrase,
  randEmail,
  randFirstName,
  randIp,
  randLastName,
  randLines,
  randParagraph,
  randUserName,
} from "@ngneat/falso";
import { v4 } from "uuid";
import { hash } from "bcryptjs";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

const password = "jasonraimondi";

const jasonId = "f42236b9-8aae-4dbc-b78a-e314a5ed6d22";
const adminId = "dd74961a-c348-4471-98a5-19fc3c5b5079";

void (async function () {
  const passwordHash = await hash(password, 10);

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

  const jason = await prisma.user.upsert({
    where: { id: jasonId },
    update: { passwordHash },
    create: {
      id: jasonId,
      email: "jason@raimondi.us",
      isEmailConfirmed: true,
      nickname: "Jason",
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

  await prisma.user.createMany({
    data: new Array(20).fill(undefined).map(() => ({
      email: randEmail({ provider: "example", suffix: "com" }),
      nickname: rand([randUserName(), randFirstName(), randLastName()]),
      isEmailConfirmed: rand([true, true, true, false]),
      createdIP: randIp(),
      passwordHash,
    })),
  });

  const book1 = v4();
  await prisma.book.upsert({
    where: { id: book1 },
    update: {},
    create: {
      id: book1,
      title: randCatchPhrase(),
      subtitle: randCatchPhrase(),
      status: BookStatus.working,
      userId: jasonId,
    },
  });

  const userIds: string[] = (await prisma.user.findMany({ select: { id: true } })).map(u => u.id);

  await prisma.book.createMany({
    data: new Array(50).fill(undefined).map(() => ({
      id: v4(),
      title: randCatchPhrase(),
      subtitle: rand([randCatchPhrase(), null]),
      status: rand([BookStatus.draft, BookStatus.working, BookStatus.final]),
      userId: rand(userIds),
    })),
  });

  const bookIds: string[] = (await prisma.book.findMany({ select: { id: true } })).map(u => u.id);

  await prisma.chapter.createMany({
    data: new Array(25).fill(undefined).map(() => ({
      id: v4(),
      content: randParagraph(),
      title: rand([randCatchPhrase(), null, null]),
      status: rand([ChapterStatus.draft, ChapterStatus.working, ChapterStatus.final]),
      userId: rand(userIds),
      bookId: rand(bookIds),
    })),
  });
})();
