const TOKEN_KEY = "hrms_access_token";
const REFRESH_TOKEN_KEY = "hrms_refresh_token";

export const tokenStorage = {
  getAccessToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(TOKEN_KEY);
  },
  setAccessToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(TOKEN_KEY, token);
  },
  getRefreshToken(): string | null {
    if (typeof window === "undefined") {
      return null;
    }

    return window.localStorage.getItem(REFRESH_TOKEN_KEY);
  },
  setRefreshToken(token: string) {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear() {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.removeItem(TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
