import { TestingModule } from "@nestjs/testing";

import { AuthModule } from "~/app/auth/auth.module";
import { createTestingModule } from "~test/app_testing.module";
import { GoogleController } from "~/app/auth/controllers/google.controller";

describe("GoogleController", () => {
  let controller: GoogleController;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [AuthModule],
    });

    controller = module.get<GoogleController>(GoogleController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
