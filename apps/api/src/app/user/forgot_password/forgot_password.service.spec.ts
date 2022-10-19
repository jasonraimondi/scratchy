import { ForgotPasswordService } from "~/app/user/forgot_password/forgot_password.service";
import { createTestingModule, TestingModule } from "$test/app_testing.module";
import { ForgotPasswordRepository } from "~/lib/database/repositories/forgot_password.repository";
import { ForgotPasswordMailer } from "~/lib/email/mailers/forgot_password.mailer";
import { generateForgotPasswordToken, generateUser } from "$test/generators/generateUser";
import { User } from "~/entities/user.entity";

describe(ForgotPasswordService.name, () => {
  let testingModule: TestingModule;
  let service: ForgotPasswordService;
  let repository: ForgotPasswordRepository;

  beforeAll(async () => {
    testingModule = await createTestingModule({
      providers: [ForgotPasswordService, ForgotPasswordMailer],
    });
    repository = testingModule.container.get(ForgotPasswordRepository);
    service = testingModule.container.get(ForgotPasswordService);
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

  it("#sendForgotPasswordEmail success", async () => {
    // arrange
    const user = await generateUser(testingModule.prisma);

    // act
    await service.sendForgotPasswordEmail(user.email);

    // assert
    const updatedForgotPassword = await repository.findForUser(user.id);
    expect(updatedForgotPassword.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("#updatePasswordFromToken success", async () => {
    // arrange
    const user = await generateUser(testingModule.prisma);
    const forgotPassword = await generateForgotPasswordToken(testingModule.prisma, { userId: user.id });

    // act
    await service.updatePasswordFromToken({
      email: user.email,
      token: forgotPassword.id,
      password: "my-new-password",
    });

    // assert
    const updatedUser = User.fromPrisma(
      await testingModule.prisma.user.findUniqueOrThrow({ where: { id: user.id }})
    );
    await expect(updatedUser.verify("my-new-password")).resolves.toBeUndefined();
    await expect(repository.findById(forgotPassword.id)).rejects.toThrowError(
      /No UserToken found/,
    );
  });
});
