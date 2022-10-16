import type { FastifyInstance } from "fastify";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Injectable } from "@nestjs/common";

@Injectable()
export class OAuthClientService {
  public readonly fastify: FastifyInstance;

  constructor(adapterHost: HttpAdapterHost<FastifyAdapter>) {
    this.fastify = adapterHost.httpAdapter.getInstance();
  }
}
