import Cookies from "js-cookie";

export function getAuthHeaders() {
  const accessToken = Cookies.get("access_token");

  const headers: Record<string, string> = {};

  if (accessToken) {
    try {
      const decodedToken: any = JSON.parse(accessToken);
      headers.authorization = "Bearer " + decodedToken.token;
    } catch (e) {}
  }

  return headers;
}
