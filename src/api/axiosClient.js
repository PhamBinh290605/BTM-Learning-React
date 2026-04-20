import axios from 'axios';
import { clearSession, getAccessToken, getRefreshToken, saveSession } from '../utils/session';

const PROTECTED_ROUTE_PREFIXES = [
  '/admin',
  '/instructor',
  '/dashboard',
  '/my-learning',
  '/learning',
  '/profile',
  '/certificates',
];

const shouldRedirectToLogin = (pathname = '') => {
  return PROTECTED_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
};

const normalizeRequestPath = (url = '') => {
  const [rawPath] = String(url).split('?');
  let pathWithoutQuery = rawPath;

  if (/^https?:\/\//i.test(pathWithoutQuery)) {
    try {
      pathWithoutQuery = new URL(pathWithoutQuery).pathname;
    } catch {
      // Keep raw value when URL parsing fails.
    }
  }

  if (!pathWithoutQuery) {
    return '';
  }

  // Handles both absolute URLs and axios relative URLs.
  const withLeadingSlash = pathWithoutQuery.startsWith('/')
    ? pathWithoutQuery
    : `/${pathWithoutQuery}`;

  const apiPrefix = '/api/v1';
  if (withLeadingSlash.startsWith(apiPrefix)) {
    return withLeadingSlash.slice(apiPrefix.length) || '/';
  }

  return withLeadingSlash;
};

const isPublicCatalogGetRequest = (method = 'get', url = '') => {
  if (String(method).toLowerCase() !== 'get') {
    return false;
  }

  const path = normalizeRequestPath(url);

  return (
    path === '/courses' ||
    path.startsWith('/course/') ||
    path.startsWith('/categories') ||
    path.startsWith('/course-reviews/course/') ||
    path.startsWith('/certificates/verify')
  );
};

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8088/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token && !isPublicCatalogGetRequest(config.method, config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (config.headers) {
    delete config.headers.Authorization;
    delete config.headers.authorization;
  }

  return config;
});

let isRefreshing = false;
let requestQueue = [];

const processQueue = (error, token = null) => {
  requestQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
      return;
    }

    promise.resolve(token);
  });

  requestQueue = [];
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token not found');
  }

  const response = await axios.post(
    `${axiosClient.defaults.baseURL}/auth/refresh`,
    { refreshToken },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const result = response?.data?.result;

  if (!result?.accessToken) {
    throw new Error('Invalid refresh token response');
  }

  saveSession({
    accessToken: result.accessToken,
    refreshToken: result.refreshToken || refreshToken,
  });

  return result.accessToken;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const isUnauthorized = error.response?.status === 401;
    const requestUrl = String(originalRequest?.url || '');
    const hasAuthHeader = Boolean(
      originalRequest?.headers?.Authorization || originalRequest?.headers?.authorization
    );
    const hasAccessToken = Boolean(getAccessToken());
    const isRefreshEndpoint = requestUrl.includes('/auth/refresh');
    const canAttemptRefresh =
      isUnauthorized &&
      !originalRequest?._retry &&
      !isRefreshEndpoint &&
      hasAuthHeader &&
      hasAccessToken;

    // Public requests (no bearer token) should fail naturally without forcing login.
    if (!canAttemptRefresh) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        requestQueue.push({ resolve, reject });
      }).then((token) => {
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return axiosClient(originalRequest);
      });
    }

    isRefreshing = true;

    try {
      const newAccessToken = await refreshAccessToken();
      processQueue(null, newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      clearSession();

      if (
        typeof window !== 'undefined' &&
        window.location.pathname !== '/auth/login' &&
        shouldRedirectToLogin(window.location.pathname)
      ) {
        const returnUrl = `${window.location.pathname}${window.location.search || ''}`;
        const nextUrl = `/auth/login?redirect=${encodeURIComponent(returnUrl)}`;
        window.location.href = nextUrl;
      }

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosClient;