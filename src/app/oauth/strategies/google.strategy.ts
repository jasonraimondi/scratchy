import { HttpException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";

import { User } from "~/entity/user/user.entity";
import { UserRepo } from "~/lib/repositories/user/user.repository";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger: Logger;

  constructor(private readonly userRepository: UserRepo) {
    super({
      passReqToCallback: true,
      clientID: process.env.OAUTH_GOOGLE_ID,
      clientSecret: process.env.OAUTH_GOOGLE_SECRET,
      callbackURL: "http://localhost:3000/oauth2/google/callback",
      scope: ["email", "profile"],
    });
    this.logger = new Logger(this.constructor.name);
  }

  async validate(req: Request, accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails } = profile;
    this.logger.log(profile);
    this.logger.log(req.query);
    this.logger.log(req.body);
    const email = emails?.[0].value;
    let user: User;

    if (!email) throw new HttpException("Unauthorized no email", 401);

    try {
      user = await this.userRepository.findByEmail(email);
    } catch (e) {
      user = await User.create({
        email,
        firstName: name?.givenName,
        lastName: name?.familyName,
        createdIP: req.ip,
      });
      user.isEmailConfirmed = !!profile._json.email_verified; // @this value is... sketchy to say the least
      user.oauthGoogleIdentifier = profile.id;
      user = await this.userRepository.save(user);
    }

    await this.userRepository.incrementLastLogin(user, req.ip);

    done(undefined, user);
  }
}