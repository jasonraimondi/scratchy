import { Controller, Post, Req, Res } from "@nestjs/common";
import { Request, Response } from "express";
// import { AuthService } from "~/app/auth/auth.service";
import { RefreshTokenDTO } from "~/app/auth/dto/refresh_token.dto";

export const STATUS_CODES = {
  Unauthorized: 401,
};

@Controller("/auth")
export class AuthController {
  private readonly FAILED_TO_REFRESH = { success: false, accessToken: "" };

  // constructor(private authService: AuthService) {
  // }

  @Post("refresh_token")
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const rememberMe = req.cookies?.rememberMe ?? false;
    const refreshToken = new RefreshTokenDTO(req.cookies?.jid);

    if (refreshToken.isExpired) {
      res.status(STATUS_CODES.Unauthorized);
      res.json(this.FAILED_TO_REFRESH);
      return;
    }

    // try {
    //   const { accessToken, user } = await this.authService.updateAccessToken(
    //     refreshToken.token,
    //   );
    //   this.authService.sendRefreshToken(res, rememberMe, user);
    //   res.json({ success: true, accessToken });
    //   return;
    // } catch (_) {
    // }

    res.status(STATUS_CODES.Unauthorized);
    res.json(this.FAILED_TO_REFRESH);
    return;
  }
}
