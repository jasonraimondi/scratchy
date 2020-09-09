import { API_ROUTES } from "~/lib/routes/route.service";

export const routesProviders = [
  {
    provide: "routes",
    useValue: API_ROUTES
  }
]
