import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createEmailConfirmation } from "~/entities/email_confirmation.entity";
import { EmailConfirmationModule } from "~/app/user/email_confirmation/email_confirmation.module";

import { createTestingModule, TestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

describe(EmailConfirmationService.name, () => {
  let testingModule: TestingModule;
  let resolver: EmailConfirmationService;
  let userRepository: UserRepository;
  let emailConfirmationRepository: EmailConfirmationRepository;

  beforeAll(async () => {
    testingModule = await createTestingModule({
      imports: [EmailConfirmationModule],
    });
    userRepository = testingModule.container.get(UserRepository);
    emailConfirmationRepository = testingModule.container.get(EmailConfirmationRepository);
    resolver = testingModule.container.get(EmailConfirmationService);
  });

  afterAll(async () => {
    await testingModule.container.close();
  });

  it.skip("resolve user by id", async () => {
    // arrange
    const user = await generateUser();
    await userRepository.create(user);
    const emailConfirmation = await createEmailConfirmation({ user });

    testingModule.mockDB.emailConfirmationToken.findFirst.mockResolvedValue(emailConfirmation);
    await emailConfirmationRepository.create(emailConfirmation);

    // act
    await resolver.verifyEmailConfirmation(user.email, emailConfirmation.id);
    const result = emailConfirmationRepository.findByEmail(user.email);

    // assert
    await expect(result).rejects.toThrowError("No EmailConfirmationToken found");
  });
});
