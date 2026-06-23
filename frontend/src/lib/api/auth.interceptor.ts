import { api } from "./axios";
import { tokenStorage } from "./storage";

export function attachAuthInterceptor() {
  api.interceptors.request.use((config) => {
    const token = tokenStorage.getAccessToken();

    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });
}
