import { FastifyInstance } from "fastify";
import { HttpAdapterHost } from "@nestjs/core";
import { FastifyAdapter } from "@nestjs/platform-fastify";
import { Injectable } from "@nestjs/common";

@Injectable()
export class FastifyOAuthClientService {
  public readonly fastify: FastifyInstance;

  constructor(adapterHost: HttpAdapterHost<FastifyAdapter>) {
    this.fastify = adapterHost.httpAdapter.getInstance();
  }

  get github() {
    return this.fastify.Google;
  }

  get google() {
    return this.fastify.GitHub;
  }

  get facebook() {
    return this.fastify.Facebook;
  }
}
