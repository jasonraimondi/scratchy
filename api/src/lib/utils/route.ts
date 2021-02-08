import { ENV } from "~/config/configuration";
import { API_ROUTES } from "~/config/routes";

type RouteParams = Record<string, number | string>;

export const route = (path: string) => {
  if (path[0] === "/") path = path.substr(1, path.length);
  const template = ENV.url.toString() + path;
  const create = (obj: RouteParams = {}) => {
    let result = template;
    Object.entries(obj).forEach(([key, value]) => {
      result = result.replace(`:${key}`, value.toString());
    });
    return result;
  };
  return { template, create };
};

export type RouteType = typeof API_ROUTES;
