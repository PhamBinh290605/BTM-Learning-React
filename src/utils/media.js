const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8088/api/v1";
const API_HOST = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

export const resolveMediaUrl = (mediaUrl) => {
  if (!mediaUrl) return "";

  const normalized = String(mediaUrl).trim();
  if (!normalized) return "";

  if (/^(https?:|data:|blob:)/i.test(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("//")) {
    return `https:${normalized}`;
  }

  if (normalized.startsWith("/")) {
    return `${API_HOST}${normalized}`;
  }

  return `${API_HOST}/${normalized}`;
};