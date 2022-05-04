import { PrismaClient } from "@modules/prisma/client";
import { MockProxy } from "jest-mock-extended";

import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

import { UserResolver } from "~/app/user/user.resolver";
import { UserModule } from "~/app/user/user.module";

describe("register resolver", () => {
  let userResolver: UserResolver;
  let mockDB: MockProxy<PrismaClient>;

  beforeAll(async () => {
    const testingModule = await createTestingModule({
      imports: [UserModule],
    });
    mockDB = testingModule.mockDB;
    userResolver = testingModule.container.get<UserResolver>(UserResolver);
  });

  it("resolve user by email", async () => {
    // arrange
    const user = await generateUser();
    mockDB.user.findFirst.mockResolvedValue(user);

    // act
    const result = await userResolver.user(user.email);

    // assert
    expect(result.id).toBe(user.id);
    expect(result.email).toBe(user.email);
    expect(result.firstName).toBe(user.firstName);
  });
});
