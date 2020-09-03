import { TestingModule } from "@nestjs/testing";

import { Permission } from "~/entity/role/permission.entity";
import { Role } from "~/entity/role/role.entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation.entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password.entity";
import { User } from "~/entity/user/user.entity";
import { isAuth } from "~/lib/middlewares/is_auth";
import { MyContext } from "~/lib/types/my_context";
import { createTestingModule } from "~test/app_testing.module";
import { mockContext, mockRequest, mockResponse } from "~test/mock_application";

describe("is_auth", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingModule;
  let context: MyContext;
  const next = jest.fn();

  beforeEach(async () => {
    container = await createTestingModule({}, entities);
    context = mockContext({ container });
  });

  test("updates context", async () => {
    // arrange
    // act
    const params: any = { context };

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
  });

  test("guards against missing token", async () => {
    // arrange
    // act
    const params: any = { context };

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

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError("not authenticated");
  });
});
