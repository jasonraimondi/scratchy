import { TestingModule } from "@nestjs/testing";
import { AuthModule } from "~/app/auth/auth.module";
import { createTestingModule } from "~test/app_testing.module";
import { AuthService } from "~/app/auth/services/auth.service";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await createTestingModule({
      imports: [AuthModule],
    });

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
