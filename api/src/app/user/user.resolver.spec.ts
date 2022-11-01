import { createTestingModule, TestingModule } from "$test/app_testing.module";
import { generateUser } from "$test/generators/generateUser";

import { UserResolver } from "~/app/user/user.resolver";
import { UserModule } from "~/app/user/user.module";

describe("register resolver", () => {
  let userResolver: UserResolver;
  let testingModule: TestingModule;

  beforeAll(async () => {
    const testingModule = await createTestingModule({
      imports: [UserModule],
    });
    userResolver = testingModule.container.get(UserResolver);
  });

  afterAll(async () => {
    await testingModule.prisma.$transaction([testingModule.prisma.user.deleteMany()]);
  });

  it.skip("resolve user by email", async () => {
    // arrange
    const user = await generateUser(testingModule.prisma);

    // act
    const result = await userResolver.userByEmail(user.email);

    // assert
    expect(result.id).toBe(user.id);
    expect(result.email).toBe(user.email);
    expect(result.nickname).toBe(user.nickname);
  });
});
