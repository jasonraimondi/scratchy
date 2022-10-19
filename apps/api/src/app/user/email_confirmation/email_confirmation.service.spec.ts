import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";

import { createTestingModule, TestingModule } from "$test/app_testing.module";
import { generateEmailConfirmationToken, generateUser } from "$test/generators/generateUser";

describe(EmailConfirmationService.name, () => {
  let testingModule: TestingModule;
  let service: EmailConfirmationService;
  let repository: EmailConfirmationRepository;

  beforeAll(async () => {
    testingModule = await createTestingModule({
      providers: [EmailConfirmationService],
    });
    repository = testingModule.container.get(EmailConfirmationRepository);
    service = testingModule.container.get(EmailConfirmationService);
  });

  afterEach(async () => {
    await testingModule.prisma.$transaction([
      testingModule.prisma.userToken.deleteMany(),
      testingModule.prisma.user.deleteMany(),
    ]);
  });

  afterAll(async () => {
    await testingModule.container.close();
    await testingModule.prisma.$disconnect();
  });

  it("resolve user by id", async () => {
    // arrange
    const user = await generateUser(testingModule.prisma);
    const emailConfirmation = await generateEmailConfirmationToken(testingModule.prisma, { userId: user.id, user });

    // act
    await service.verifyEmailConfirmation(user.email, emailConfirmation.id);
    const result = repository.findByEmail(user.email);

    // assert
    await expect(result).rejects.toThrowError(/No UserToken found/);
  });

  it("throws for invalid email", async () => {
    // arrange
    const user = await generateUser(testingModule.prisma);
    const emailConfirmation = await generateEmailConfirmationToken(testingModule.prisma, { userId: user.id, user });

    // act
    const result = service.verifyEmailConfirmation("invalid@email.com", emailConfirmation.id);

    // assert
    await expect(result).rejects.toThrowError(/invalid user and confirmation/);
  });
});
