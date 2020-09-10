import { SERVICES } from "~/config/keys";
import { API_ROUTES } from "~/lib/routes/route.service";

export const routesProviders = [
  {
    provide: SERVICES.routes,
    useValue: API_ROUTES,
  },
];
