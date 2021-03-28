import { HttpException, Injectable, Logger } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import type { FastifyRequest } from "fastify";
import { Profile, Strategy } from "passport-github";
import { VerifyCallback } from "passport-google-oauth20";

import { ENV } from "~/config/environments";
import { createUser, User } from "~/app/user/entities/user.entity";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { UnauthorizedException } from "~/app/user/exceptions/unauthorized.exception";

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, "github") {
  private readonly logger: Logger;

  constructor(private readonly userRepository: UserRepository) {
    super({
      passReqToCallback: true,
      clientID: ENV.oauth.github.clientId,
      clientSecret: ENV.oauth.github.clientSecret,
      callbackURL: ENV.oauth.github.callbackURL,
      scope: ["email", "profile"],
    });
    this.logger = new Logger(this.constructor.name);
  }

  async validate(
    req: FastifyRequest,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { emails } = profile;
    const email = emails?.[0].value;
    let user: User;

    if (!email) throw new UnauthorizedException("no email was found from github");

    try {
      user = await this.userRepository.findByEmail(email);
      if (!user.oauthGithubIdentifier) {
        user.oauthGithubIdentifier = profile.id;
        await this.userRepository.update(user);
      }
    } catch (e) {
      user = await createUser({
        email,
        createdIP: req.ip,
      });
      user.isEmailConfirmed = true;
      user.oauthGithubIdentifier = profile.id;
      user = await this.userRepository.create(user);
    }

    await this.userRepository.incrementLastLogin(user.email, req.ip);

    done(undefined, user);
  }
}
