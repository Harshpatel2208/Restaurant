const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

// Keep local development working with Vite proxy when no base URL is configured.
const API_BASE_URL = configuredBaseUrl ? configuredBaseUrl.replace(/\/+$/, '') : '';

export const getApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalizedPath}` : normalizedPath;
};
