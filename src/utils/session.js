import { getRoleFromToken } from "./jwt";

const ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refresh_token";
const ROLE_KEY = "user_role";
const USER_NAME_KEY = "user_full_name";

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveSession = ({ accessToken, refreshToken, user }) => {
  if (accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);

    const role = getRoleFromToken(accessToken);
    if (role) {
      localStorage.setItem(ROLE_KEY, role);
    }
  }

  if (refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  if (user?.fullName) {
    localStorage.setItem(USER_NAME_KEY, user.fullName);
  }
};

export const clearSession = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
  localStorage.removeItem(USER_NAME_KEY);
};

export const getStoredRole = () => {
  const token = getAccessToken();
  const tokenRole = getRoleFromToken(token);

  if (tokenRole) {
    localStorage.setItem(ROLE_KEY, tokenRole);
    return tokenRole;
  }

  return localStorage.getItem(ROLE_KEY);
};

export const getStoredFullName = () => localStorage.getItem(USER_NAME_KEY);

export const getDefaultRouteByRole = (role) => {
  if (role === "ADMIN") {
    return "/admin";
  }

  if (role === "INSTRUCTOR") {
    return "/instructor";
  }

  return "/dashboard";
};
