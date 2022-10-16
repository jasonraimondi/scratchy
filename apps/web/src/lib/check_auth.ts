import { isAuthenticated, refreshToken } from "$lib/auth/auth";

export async function checkAuth() {
  if (isAuthenticated()) return true;
  return refreshToken();
}
