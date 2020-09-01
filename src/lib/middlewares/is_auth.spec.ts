import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role_entity";
import { createTestingModule } from "~/app/app_testing.module";
import { User } from "~/entity/user/user_entity";
import { Permission } from "~/entity/role/permission_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { MyContext } from "~/lib/types/my_context";
import { mockContext, mockRequest, mockResponse } from "~test/mock_application";
import { isAuth } from "~/lib/middlewares/is_auth";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";

describe("is_auth", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let context: MyContext;

  beforeEach(async () => {
    container = await createTestingModule({}, entities);
    context = mockContext({ container });
  });

  test("updates context", async () => {
    // arrange
    // act
    const params: any = { context };
    const next: any = () => {};

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
  });

  test("guards against missing token", async () => {
    // arrange
    // act
    const params: any = { context };
    const next: any = () => {};

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
  });

  test("guards against invalid token", async () => {
    // arrange
    context = {
      req: mockRequest("bearer foobar-valid-jwt"),
      res: mockResponse(),
      container,
    };

    // act
    const params: any = { context };
    const next: any = () => {};

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
  });
});
