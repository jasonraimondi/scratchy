import { ENV } from "~/config/environments";
import { WEB_ROUTES } from "~/config/routes";

type RouteParams = Record<string, number | string>;

export const route = (path: string) => {
  if (path[0] === "/") path = path.substr(1, path.length);
  let template = path;
  if (ENV.urls.web) template = ENV.urls.web.toString() + template;
  const create = (obj: RouteParams = {}) => {
    let result = template;
    Object.entries(obj).forEach(([key, value]) => {
      result = result.replace(new RegExp(`:${key}`), value.toString());
    });
    return result;
  };
  return { template, create };
};

export type RouteType = typeof WEB_ROUTES;
