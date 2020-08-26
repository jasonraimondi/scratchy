import { TestingModule } from "@nestjs/testing";

import { AuthController } from "./auth.controller";
import { createTestingModule } from "../../../test/test_container";
import { AuthService } from "./auth.service";
import { EmailConfirmationToken } from "../../entity/user/email_confirmation_entity";
import { User } from "../../entity/user/user_entity";
import { Role } from "../../entity/role/role_entity";
import { Permission } from "../../entity/role/permission_entity";
import { ForgotPasswordToken } from "../../entity/user/forgot_password_entity";

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
  });
});
