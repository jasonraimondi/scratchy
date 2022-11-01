import { randEmail } from "@ngneat/falso";
import { validate } from "class-validator";

import { createTestingModule, TestingModule } from "$test/app_testing.module";
import { generateUser } from "$test/generators/generateUser";
import { emails } from "$test/mock_email_service";

import { EmailConfirmationRepository } from "~/lib/database/repositories/email_confirmation.repository";
import { RegisterInput } from "~/app/user/register/register.input";
import { RegisterResolver } from "~/app/user/register/register.resolver";
import { mockContext } from "$test/mock_application";

describe(RegisterResolver.name, () => {
  let testingModule: TestingModule;
  let resolver: RegisterResolver;
  let context = mockContext();

  beforeAll(async () => {
    testingModule = await createTestingModule({
      providers: [RegisterResolver],
    });
    resolver = testingModule.container.get(RegisterResolver);
  });

  afterEach(async () => {
    await testingModule.prisma.$transaction([testingModule.prisma.user.deleteMany()]);
  });

  afterAll(async () => {
    await testingModule.container.close();
    await testingModule.prisma.$disconnect();
  });

  describe("register function", () => {
    it("valid register input is validated correctly", async () => {
      // arrange
      const validInput = new RegisterInput();
      validInput.email = randEmail();

      // act
      const validationErrors = await validate(validInput);

      // assert
      expect(validationErrors.length).toBe(0);
    });

    it("invalid register input has errors thrown", async () => {
      // arrange
      const validInput = new RegisterInput();
      validInput.email = "invalid@email";

      // act
      const validationErrors = await validate(validInput);

      // assert
      expect(validationErrors.length).toBe(1);
    });

    test("duplicate user id is denied", async () => {
      // arrange
      const input = new RegisterInput();
      input.id = "b031765a-a950-4a0d-92dd-ecd12788f3a6";
      input.email = randEmail();
      await generateUser(testingModule.prisma, input);

      // act
      const result = resolver.register(input, context);

      // assert
      await expect(result).rejects.toThrowError("duplicate id for user");
    });

    it("duplicate user emails is denied", async () => {
      // arrange
      const input = new RegisterInput();
      input.email = randEmail();
      await generateUser(testingModule.prisma, input);

      // act
      const result = resolver.register(input, context);

      // assert
      await expect(result).rejects.toThrowError("duplicate emails for user");
    });

    it.skip("user is registered with emails confirmation", async () => {
      // arrange
      const input = new RegisterInput();
      input.email = randEmail();

      // act
      const result = await resolver.register(input, context);

      // assert
      const emailConfirmationRepository = testingModule.container.get(EmailConfirmationRepository);
      const emailConfirmation = await emailConfirmationRepository.findByEmail(input.email);
      expect(result).toBeTruthy();
      expect(result.id).toBe(emailConfirmation.user?.id);
      expect(result.email).toBe(input.email.toLowerCase());
      expect(result.isEmailConfirmed).toBeFalsy();
      expect(emails.length).toBe(1);
      expect(emails[0].to).toBe(input.email.toLowerCase());
      expect(emails[0].context!.url).toBe(`http://localhost/verify_email?e=${result.email}&u=${emailConfirmation.id}`);
    });
  });

  describe("resentConfirmEmail", () => {
    it.skip("resend emails function works", async () => {
      // arrange
      const input = new RegisterInput();
      input.email = randEmail();
      await resolver.register(input, context);

      // act
      const result = await resolver.resendConfirmEmail(input.email);

      // assert
      expect(result).toBe(true);
      expect(emails.length).toBe(2);
      expect(emails[0].template).toBe("auth/register");
      expect(emails[1].template).toBe("auth/register");
    });

    it("resend emails throws for invalid user", async () => {
      // act
      const result = resolver.resendConfirmEmail("user-does-not-exist@example.com");

      // assert
      await expect(result).rejects.toThrow(new RegExp("No UserToken found"));
      expect(emails.length).toBe(0);
    });
  });
});
