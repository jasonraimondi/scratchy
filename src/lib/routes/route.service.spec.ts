import { TestingModule } from "@nestjs/testing";
import { RouteType } from "~/lib/routes/route.service";

import { createTestingModule } from "~test/app_testing.module";
import { SERVICES } from "~/config/keys";
import { RoutesModule } from "./routes.module";

describe("route service", () => {
  let container: TestingModule;
  let routeService: RouteType;

  beforeAll(async () => {
    container = await createTestingModule({
      imports: [RoutesModule]
    });
    routeService = container.get(SERVICES.routes);
  });

  test("route generation", () => {
    const myRoute = routeService._testing;

    const template = myRoute.template;
    const createdRoute = myRoute.create({ photoId: 123 });

    expect(template).toBe("localhost/photo/:photoId");
    expect(createdRoute).toBe("localhost/photo/123");
  });
});