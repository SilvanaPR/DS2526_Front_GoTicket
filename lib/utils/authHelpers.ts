import { getCookie } from "cookies-next";

export function getAuthData() {
  const token = getCookie("access_token");
  const userId = getCookie("userId");
  return { token, userId };
}
