import { ENV } from "~/config/environment";

type RouteParams = { [key: string]: string | number };

export const route = (path: string) => {
  const template = ENV.domain + path;
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

export const API_ROUTES = {
  verify_email: route("/verify_email?e=:email&u=:id"),
  forgot_password: route("/reset_password?e=:email&u=:id"),
  _testing: route("/photo/:photoId"),
};
