const decodeBase64Url = (value) => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - (normalized.length % 4)) % 4);
  return atob(normalized + padding);
};

export const decodeToken = (token) => {
  try {
    if (!token) return null;

    const parts = token.split(".");
    if (parts.length < 2) return null;

    return JSON.parse(decodeBase64Url(parts[1]));
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};

export const getRoleFromToken = (token) => {
  const payload = decodeToken(token);
  return payload?.role || null;
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload?.exp) return true;
  return Date.now() >= payload.exp * 1000;
};