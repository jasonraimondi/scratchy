import { User } from "../../entity/user/user_entity";
import { Role } from "../../entity/role/role_entity";
import { Permission } from "../../entity/role/permission_entity";
import { ForgotPasswordToken } from "../../entity/user/forgot_password_entity";
import { EmailConfirmationToken } from "../../entity/user/email_confirmation_entity";
import { TestingContainer } from "../../../test/test_container";
import { MyContext } from "../types/my_context";
import { isAuth } from "./is_auth";
import { mockRequest, mockResponse } from "../../../test/mock_application";

describe("is_auth", () => {
  const entities = [User, Role, Permission, ForgotPasswordToken, EmailConfirmationToken];

  let container: TestingContainer;
  let context: MyContext;

  beforeEach(async () => {
    container = await TestingContainer.create(entities);
    context = {
      res: mockResponse(),
      req: mockRequest(),
      container,
    };
  });

  test("updates context", async () => {
    // arrange
    // act
    const params: any = { context };
    const next: any = () => {};

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError(
      "not authenticated",
    );
  });

  test("guards against missing token", async () => {
    // arrange
    // act
    const params: any = { context };
    const next: any = () => {};

    // assert
    await expect(isAuth(params, next)).rejects.toThrowError(
      "not authenticated",
    );
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
    await expect(isAuth(params, next)).rejects.toThrowError(
      "not authenticated",
    );
  });
});
