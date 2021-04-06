import { TestingModule } from "@nestjs/testing";

import { AccountModule } from "~/app/account/account.module";
import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { Permission } from "~/app/user/entities/permission.entity";
import { Role } from "~/app/user/entities/role.entity";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";

describe(ForgotPasswordService.name, () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let service: ForgotPasswordService;
  let userRepository: UserRepository;
  let forgotPasswordRepository: ForgotPasswordRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [AccountModule],
      },
      entities,
    );
    userRepository = moduleRef.get<UserRepository>(UserRepository);
    forgotPasswordRepository = moduleRef.get<ForgotPasswordRepository>(ForgotPasswordRepository);
    service = moduleRef.get(ForgotPasswordService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("sendForgotPasswordEmail", () => {
    test("success", async () => {
      // arrange
      const user = await generateUser({ email: "jason1@raimondi.us" });
      user.isEmailConfirmed = true;
      await userRepository.create(user);

      // act
      await service.sendForgotPasswordEmail(user.email);

      // assert
      const updatedForgotPassword = await forgotPasswordRepository.findForUser(user.id);
      expect(updatedForgotPassword.expiresAt.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe("updatePasswordFromToken", () => {
    test("success", async () => {
      // arrange
      const user = await generateUser();
      user.isEmailConfirmed = true;
      await userRepository.create(user);
      const forgotPassword = new ForgotPasswordToken();
      await forgotPasswordRepository.create(forgotPassword);

      // act
      await service.updatePasswordFromToken(user.email, forgotPassword.id, "my-new-password");

      // assert
      const updatedUser = await userRepository.findById(user.id);
      await expect(updatedUser.verify("my-new-password")).resolves.toBeUndefined();
      await expect(forgotPasswordRepository.findForUser(forgotPassword.id)).rejects.toThrowError(
        'Could not find any entity of type "ForgotPasswordToken"',
      );
    });
  });
});
