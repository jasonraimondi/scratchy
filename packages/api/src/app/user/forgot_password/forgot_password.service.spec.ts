import { TestingModule } from "@nestjs/testing";

import { ForgotPasswordService } from "~/app/user/forgot_password/forgot_password.service";
import { createForgotPassword } from "~/entities/forgot_password.entity";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { createTestingModule } from "~test/app_testing.module";
import { generateUser } from "~test/generators/generateUser";
import { UserModule } from "~/app/user/user.module";

describe(ForgotPasswordService.name, () => {
  let moduleRef: TestingModule;
  let service: ForgotPasswordService;
  let userRepository: UserRepository;
  let forgotPasswordRepository: ForgotPasswordRepository;

  beforeAll(async () => {
    moduleRef = await createTestingModule(
      {
        imports: [UserModule],
      },
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
      const user = await generateUser();
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
      const forgotPassword = await createForgotPassword({ user });
      await forgotPasswordRepository.create(forgotPassword);

      // act
      await service.updatePasswordFromToken({
        email: user.email,
        token: forgotPassword.id,
        password: "my-new-password",
      });

      // assert
      const updatedUser = await userRepository.findById(user.id);
      await expect(updatedUser.verify("my-new-password")).resolves.toBeUndefined();
      await expect(forgotPasswordRepository.findForUser(forgotPassword.id)).rejects.toThrowError(
        'No ForgotPasswordToken found',
      );
    });
  });
});
