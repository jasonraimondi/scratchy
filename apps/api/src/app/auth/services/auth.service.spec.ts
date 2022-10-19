import { createTestingModule } from "$test/app_testing.module";
import { AuthService } from "~/app/auth/services/auth.service";
import { TokenService } from "~/app/auth/services/token.service";
import { JwtModule } from "~/lib/jwt/jwt.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const { container } = await createTestingModule({
      imports: [JwtModule],
      providers: [AuthService, TokenService],
    });
    service = container.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
