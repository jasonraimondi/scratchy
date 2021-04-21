import { TestingModule } from "@nestjs/testing";

import { EmailConfirmationService } from "~/app/user/email_confirmation/email_confirmation.service";
import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { UserModule } from "~/app/user/user.module";
import { createEmailConfirmation, EmailConfirmationToken } from "~/entities/email_confirmation.entity";
import { generateUser } from "~test/generators/generateUser";

describe(EmailConfirmationService.name, () => {
  let moduleRef: TestingModule;
  let resolver: EmailConfirmationService;
  let userRepository: UserRepository;
  let emailConfirmationRepository: EmailConfirmationRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule({
      imports: [UserModule],
    });
    userRepository = moduleRef.get(UserRepository);
    emailConfirmationRepository = moduleRef.get(EmailConfirmationRepository);
    resolver = moduleRef.get(EmailConfirmationService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("verify user emails confirmation", () => {
    test("resolve user by id", async () => {
      // arrange
      const user = await generateUser();
      await userRepository.create(user);
      const emailConfirmation = await createEmailConfirmation({ user });
      await emailConfirmationRepository.create(emailConfirmation);

      // act
      await resolver.verifyEmailConfirmation(user.email, emailConfirmation.id);
      const result = emailConfirmationRepository.findByEmail(user.email);

      // assert
      await expect(result).rejects.toThrowError("No EmailConfirmationToken found");
    });
  });
});
