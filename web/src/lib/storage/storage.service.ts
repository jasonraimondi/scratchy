import { LocalStorage, SessionStorage, CookieStorage } from "@jmondi/browser-storage";
import { browser } from "$app/environment";
import { RouteGroup } from "@jmondi/route-strings";

class SsrAdapter {
  clear = () => {};
  get = (_: string) => null;
  remove = (_: string) => {};
  set = (_: string, __?: any, ___?: any) => {};
}

export const localStorageService = browser ? new LocalStorage() : new SsrAdapter();
export const sessionStorageService = browser ? new SessionStorage() : new SsrAdapter();
export const cookieStorageService = browser ? new CookieStorage() : new SsrAdapter();

const storageGroup = new RouteGroup({ prefix: "app_" });

export const COOKIES = {
  accessToken: storageGroup.add("accessToken").toString(),
};

export const SESSIONS = {
  currentUser: storageGroup.add("currentUser").toString(),
};
