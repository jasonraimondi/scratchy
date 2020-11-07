import { TestingModule } from "@nestjs/testing";
import { AccountModule } from "~/app/account/account.module";

import { EmailConfirmationService } from "~/app/account/services/email_confirmation.service";
import { Permission } from "~/app/user/entities/permission.entity";
import { Role } from "~/app/user/entities/role.entity";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { EmailConfirmationRepo } from "~/app/user/repositories/repositories/email_confirmation.repository";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe(EmailConfirmationService.name, () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let resolver: EmailConfirmationService;
  let userRepository: UserRepo;
  let emailConfirmationRepository: EmailConfirmationRepo;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [AccountModule],
      },
      entities,
    );
    userRepository = moduleRef.get(UserRepo);
    emailConfirmationRepository = moduleRef.get(EmailConfirmationRepo);
    resolver = moduleRef.get(EmailConfirmationService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("verify user emails confirmation", () => {
    test("resolve user by id", async () => {
      // arrange
      const user = await userGenerator();
      await userRepository.save(user);
      const emailConfirmation = new EmailConfirmationToken(user);
      await emailConfirmationRepository.save(emailConfirmation);

      // act
      await resolver.verifyEmailConfirmation(user.email, emailConfirmation.id);
      const result = emailConfirmationRepository.findByEmail(user.email);

      // assert
      await expect(result).rejects.toThrowError('Could not find any entity of type "EmailConfirmationToken"');
    });
  });
});
