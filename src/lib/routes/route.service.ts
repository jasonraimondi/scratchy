import { ENV } from "~/config/environment";

export const route = (path: string) => {
  path = `${ENV.baseURL}${path}`;
  const template = path;
  const create = (obj: any = {}) => {
    let result = template;
    if (!obj) return result;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result = result.replace(`:${key}`, obj[key]);
      }
    }
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
