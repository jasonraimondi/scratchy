import { Controller, Get, Post, Req, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "~/app/auth/guards/local.guard";
import { AuthService } from "~/app/auth/services/auth.service";
import { JwtAuthGuard } from "~/app/auth/guards/jwt_auth.guard";
import { AuthUser } from "~/app/user/auth_user.decorator";
import { User } from "~/app/user/entities/user.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@AuthUser() user: User) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req: any) {
    console.log("HI YA JASON", req.user);
    return req.user;
  }
}
