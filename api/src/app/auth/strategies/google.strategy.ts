import { HttpException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { Request } from "express";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import { ENV } from "~/config/configuration";

import { User } from "~/app/user/entities/user.entity";
import { UserRepo } from "~/app/user/repositories/repositories/user.repository";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google") {
  private readonly logger: Logger;

  constructor(private readonly userRepository: UserRepo) {
    super({
      passReqToCallback: true,
      clientID: ENV.oauth.google.clientId,
      clientSecret: ENV.oauth.google.clientSecret,
      callbackURL: ENV.oauth.google.callbackURL,
      scope: ["email", "profile"],
    });
    this.logger = new Logger(this.constructor.name);
  }

  async validate(
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails } = profile;
    this.logger.log(profile);
    this.logger.log(req.query);
    this.logger.log(req.body);
    const email = emails?.[0].value;
    let user: User;

    if (!email) throw new HttpException("Unauthorized no email", 401);

    try {
      user = await this.userRepository.findByEmail(email);
      if (!user.oauthGoogleIdentifier) {
        user.oauthGoogleIdentifier = profile.id;
        await this.userRepository.save(user);
      }
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
