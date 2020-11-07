import { ENV } from "~/config/configuration";
import { API_ROUTES } from "~/config/routes";

type RouteParams = Record<string, number | string>;

export const route = (path: string) => {
  if (path[0] === "/") path = path.substr(1, path.length);
  const template = ENV.url + "/" + path;
  const create = (obj: RouteParams = {}) => {
    let result = template;
    Object.keys(obj).forEach((key) => {
      result = result.replace(`:${key}`, obj[key].toString());
    });
    return result;
  };
  return { template, create };
};

export type RouteType = typeof API_ROUTES;
