import { TestingModule } from "@nestjs/testing";

import { User } from "~/app/user/entities/user.entity";
import { Order } from "~/lib/database/dtos/inputs/paginator.inputs";
import { UserRepo } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe("user repositories", () => {
  let container: TestingModule;
  let userRepository: UserRepo;
  let users: User[];

  beforeAll(async () => {
    container = await createTestingModule();
    userRepository = container.get<UserRepo>(UserRepo);
    users = [
      await userGenerator({ id: "c3c5df06-b4e7-498b-bdbf-3f3138404b31" }),
      await userGenerator({ id: "b4e46399-5401-4a58-b7d7-3a8b37bda8a0" }),
      await userGenerator({ id: "9d589af7-234b-4fbc-b6fa-8a1343b5736e" }),
      await userGenerator({ id: "02a5887d-9ae5-49b1-8c05-88714b506cab" }),
      await userGenerator({ id: "55a5db1b-d585-446d-b063-71574edafa9a" }),
    ];
    for (const user of users) {
      await userRepository.create(user);
    }
  });

  test.only("limits and order desc", async () => {
    const data = await userRepository.list({ take: 3, order: "desc" });
    console.log(data);
    // const [user1, user2, user3] = users;

    expect(data.length).toBe(3);
    // expect(data[0].id).toBe(user1.id);
    // expect(data[1].id).toBe(user2.id);
    // expect(data[2].id).toBe(user3.id);
    // expect(cursor.beforeCursor).toBeNull();
    // expect(cursor.afterCursor).toMatch(new RegExp("[a-zA-Z\\d]"));
  });
});
