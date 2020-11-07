import { Controller, Get } from "@nestjs/common";

@Controller("healthcheck")
export class HealthcheckController {
  @Get()
  public healthcheck() {
    return { message: "OK" };
  }
}
