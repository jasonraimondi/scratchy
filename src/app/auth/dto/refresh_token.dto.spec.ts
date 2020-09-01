import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";

describe("refresh_token", () => {
  describe("should calculate expiresAt correctly", () => {
    it("for expired tokens", () => {
      const refreshToken = new RefreshTokenDTO();
      expect(refreshToken.isExpired).toBeTruthy();
    })

    // @todo add test for passing token
  })
});