import { describe, beforeEach, it, expect } from "vitest";

import { createTestingModule } from "~test/app_testing.module";
import { AuthService } from "~/app/auth/services/auth.service";
import { AuthModule } from "~/app/auth/auth.module";

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const { container } = await createTestingModule({
      imports: [AuthModule],
    });
    service = container.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
