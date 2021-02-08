import { TestingModule } from "@nestjs/testing";

import { AccountModule } from "~/app/account/account.module";
import { ForgotPasswordService } from "~/app/account/services/forgot_password.service";
import { Permission } from "~/app/user/entities/permission.entity";
import { Role } from "~/app/user/entities/role.entity";
import { EmailConfirmationToken } from "~/app/account/entities/email_confirmation.entity";
import { ForgotPasswordToken } from "~/app/account/entities/forgot_password.entity";
import { User } from "~/app/user/entities/user.entity";
import { ForgotPasswordRepo } from "~/app/user/repositories/repositories/forgot_password.repository";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { userGenerator } from "~test/generators/user.generator";

describe(ForgotPasswordService.name, () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let moduleRef: TestingModule;
  let service: ForgotPasswordService;
  let userRepository: UserRepo;
  let forgotPasswordRepository: ForgotPasswordRepo;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [AccountModule],
      },
      entities,
    );
    userRepository = moduleRef.get<UserRepo>(UserRepo);
    forgotPasswordRepository = moduleRef.get<ForgotPasswordRepo>(ForgotPasswordRepo);
    service = moduleRef.get(ForgotPasswordService);
  });

  afterAll(async () => {
    await moduleRef.close();
  });

  describe("sendForgotPasswordEmail", () => {
    test("success", async () => {
      // arrange
      const user = await userGenerator({ email: "jason1@raimondi.us" });
      user.isEmailConfirmed = true;
      await userRepository.save(user);

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
      const user = await userGenerator();
      user.isEmailConfirmed = true;
      await userRepository.save(user);
      const forgotPassword = new ForgotPasswordToken(user);
      await forgotPasswordRepository.save(forgotPassword);

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
