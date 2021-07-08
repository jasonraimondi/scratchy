import { TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { MockProxy } from "jest-mock-extended";

import { User } from "~/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

describe("user repositories", () => {
  let container: TestingModule;
  let userRepository: UserRepository;
  let users: User[];
  let mockDB: MockProxy<PrismaClient>;

  beforeAll(async () => {
    const testing = await createTestingModule({
      providers: [UserRepository],
    });
    container = testing.container;
    mockDB = testing.mockDB;

    userRepository = container.get<UserRepository>(UserRepository);
    users = [
      await generateUser({ id: "c3c5df06-b4e7-498b-bdbf-3f3138404b31" }),
      await generateUser({ id: "b4e46399-5401-4a58-b7d7-3a8b37bda8a0" }),
      await generateUser({ id: "9d589af7-234b-4fbc-b6fa-8a1343b5736e" }),
    ];
  });

  it("limits and order desc", async () => {
    mockDB.user.findMany.mockResolvedValue(users);

    const data = await userRepository.list();
    const [user1, user2, user3] = users;

    expect(data.data.length).toBe(3);
    expect(data.data[0].id).toBe(user1.id);
    expect(data.data[1].id).toBe(user2.id);
    expect(data.data[2].id).toBe(user3.id);
  });
});
