import "../src/initializer";

import { hash } from "bcryptjs";
import { PrismaClient } from "$generated/client";
import { randEmail, randFirstName, randSentence, randSlug, randWord } from "@ngneat/falso";
import { createUser } from "../src/entities/user";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

void (async function () {
  const passwordHash = await hash("password", 10);

  const adminId = "dd74961a-c348-4471-98a5-19fc3c5b5079";
  // @ts-ignore
  const admin = await prisma.user.upsert({
    where: { id: adminId },
    update: { passwordHash },
    create: {
      id: adminId,
      email: "admin@example.com",
      nickname: "admin",
      roles: ["admin"],
      createdIP: "127.0.0.1",
      passwordHash,
    },
  });

  const artistId = "0c71429f-87e6-4cc4-84a4-d5b38d7f334a";
  const artistBioId = "c31b23cb-04e3-4e5a-9519-46241f7d8163";
  // @ts-ignore
  const artist = await prisma.user.upsert({
    where: { id: artistId },
    update: { passwordHash },
    create: {
      id: artistId,
      email: "artist@example.com",
      nickname: "artist",
      createdIP: "127.0.0.1",
      roles: ["artis"],
      passwordHash,
      artistBio: {
        connectOrCreate: {
          where: { id: artistBioId },
          create: {
            id: artistBioId,
            socials: {
              twitter: "@artist-link",
              instagram: "@artist-link",
            },
          },
        },
      },
    },
  });

  const kyleId = "22eb55cd-256a-4c4d-a970-eb237f875b49";
  const kyle = await prisma.user.upsert({
    where: { id: kyleId },
    update: { passwordHash },
    create: {
      id: kyleId,
      email: "kyleconkright@gmail.com",
      isEmailConfirmed: true,
      nickname: "Kyle",
      roles: ["admin"],
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
      roles: ["admin"],
      createdIP: "127.0.0.1",
      passwordHash: passwordHash,
    },
  });

  const printIds = [
    "7a4d6962-e24b-4b22-a451-fbc432ddef44",
    "90723067-b7a9-467f-9b98-f115fb4e42ec",
    "86e90abc-3f5a-40be-955a-e0951a57ad25",
    "b9c0270a-e59a-4187-8444-14481beab461",
    "9937d6bd-7ee5-4eb8-bc13-061637db8462",
  ];

  for (const printId of printIds) {
    await prisma.user.upsert({
      where: { id: printId },
      update: {
        nickname: randFirstName(),
      },
      create: await createUser({
        createdIP: "127.0.0.1",
        email: randEmail(),
        password: "password",
      }),
    });
    await prisma.print.upsert({
      where: { id: printId },
      update: {
        url: `https://via.placeholder.com/400`,
      },
      create: {
        id: printId,
        status: "available",
        title: randWord({ length: 2 }).join(" "),
        description: randSentence(),
        slug: randSlug(),
        url: `https://via.placeholder.com/400`,
      },
    });
  }

  const usersWithPrints = [
    {
      orderId: "40a5150d-3a36-4f92-97bc-3fcf251c91a6",
      userId: jason.id,
    },
    {
      orderId: "85dc95b3-7b67-4979-9565-80f477c1d7ef",
      userId: kyle.id,
    },
  ];

  for (let { orderId, userId } of usersWithPrints) {
    await prisma.order.upsert({
      where: { id: orderId },
      update: {},
      create: {
        id: orderId,
        status: "pending",
        printId: printIds[0],
        userId,
      },
    });
  }
})();
