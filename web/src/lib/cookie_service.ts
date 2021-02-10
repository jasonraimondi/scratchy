import { base64decode, base64encode } from "@/app/lib/utils/base64";
import Cookies from "js-cookie";

class CookieService {
  private readonly storagePrefix = "scratchy__";

  get<T>(key: string): T | undefined {
    let item = Cookies.get(this.storagePrefix + key);

    if (!item) {
      return;
    }

    item = base64decode(item);

    if (item === "null" || item === "undefined") {
      return;
    }

    try {
      return JSON.parse(item);
    } catch (e) {
      console.error(e);
    }

    return;
  }

  set(key: string, value: any, options: any): boolean {
    if (value === undefined) {
      value = null;
    } else {
      value = JSON.stringify(value);
    }

    try {
      Cookies.set(this.storagePrefix + key, base64encode(value), options);
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  remove(key: string) {
    Cookies.remove(this.storagePrefix + key);
  }
}

export default new CookieService();
