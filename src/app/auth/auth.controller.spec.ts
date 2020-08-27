import { TestingModule } from "@nestjs/testing";

import { Role } from "~/entity/role/role_entity";
import { ForgotPasswordToken } from "~/entity/user/forgot_password_entity";
import { User } from "~/entity/user/user_entity";
import { EmailConfirmationToken } from "~/entity/user/email_confirmation_entity";
import { AuthService } from "~/app/auth/auth.service";
import { Permission } from "~/entity/role/permission_entity";
import { AuthController } from "~/app/auth/auth.controller";
import { createTestingModule } from "~test/test_container";

const entities = [EmailConfirmationToken, User, Role, Permission, ForgotPasswordToken];

describe("Auth Controller", () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule(
      {
        controllers: [AuthController],
        providers: [AuthService],
      },
      entities,
    );

    controller = module.get<AuthController>(AuthController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
    // @TODO Actually test stuff
  });
});
