export const getRoleFromToken = (token) => {
  try {
    if (!token) return null;

    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
};