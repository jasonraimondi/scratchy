import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get("/healthcheck")
  public healthcheck() {
    return { message: "OK" };
  }
}
