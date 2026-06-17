import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

// Access token lives in memory (module scope), not localStorage, so it
// can't be read by injected scripts. It resets on full page reload,
// which the refresh-token flow below recovers from transparently.
let accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

apiClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// On a 401, try exactly once to refresh the access token using the
// refresh token kept in an httpOnly-equivalent storage (localStorage here
// for the MVP; swap for an httpOnly cookie once the backend sets one).
let refreshPromise: Promise<string | null> | null = null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = typeof window !== 'undefined' ? window.localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        return Promise.reject(error);
      }

      if (!refreshPromise) {
        refreshPromise = apiClient
          .post('/auth/refresh', { refreshToken })
          .then((res) => {
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = res.data.data;
            setAccessToken(newAccessToken);
            window.localStorage.setItem('refreshToken', newRefreshToken);
            return newAccessToken as string;
          })
          .catch(() => {
            setAccessToken(null);
            window.localStorage.removeItem('refreshToken');
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      }
    }

    return Promise.reject(error);
  },
);
