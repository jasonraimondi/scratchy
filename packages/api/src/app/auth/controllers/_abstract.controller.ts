import { FastifyInstance } from "fastify";
import { HttpService } from "@nestjs/axios";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Controller } from "@nestjs/common";
import { UserRepository } from "~/lib/database/repositories/user.repository";
import { AuthService } from "~/app/auth/services/auth.service";

@Controller()
export abstract class AbstractProviderController {
  protected readonly fastify: FastifyInstance;

  constructor(
    adapterHost: HttpAdapterHost<FastifyAdapter>,
    protected readonly httpService: HttpService,
    protected readonly authService: AuthService,
    protected readonly userRepository: UserRepository,
  ) {
    this.fastify = adapterHost.httpAdapter.getInstance();
  }
}
