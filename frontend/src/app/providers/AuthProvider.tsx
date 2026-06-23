import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { api } from "../../lib/api/axios";
import { tokenStorage } from "../../lib/api/storage";
import type { ApiResponse } from "../../lib/api/types";

export type AppRole =
  | "SUPER_ADMIN"
  | "HR_MANAGER"
  | "PAYROLL_OFFICER"
  | "DEPARTMENT_MANAGER"
  | "EMPLOYEE";

export interface AuthUser {
  id: string;
  email: string;
  role: AppRole;
  fullName?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (data: LoginInput) => Promise<void>;
  register: (data: RegisterInput) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function extractToken(responseData: unknown): string | null {
  if (!responseData || typeof responseData !== "object") {
    return null;
  }

  const payload = responseData as {
    token?: string;
    data?: { token?: string };
  };

  return payload.token ?? payload.data?.token ?? null;
}

function extractUser(responseData: unknown): AuthUser | null {
  if (!responseData || typeof responseData !== "object") {
    return null;
  }

  const payload = responseData as {
    user?: AuthUser;
    data?: { user?: AuthUser };
  };

  return payload.user ?? payload.data?.user ?? null;
}

function decodeTokenPayload(token: string): Partial<AuthUser> | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json = atob(
      normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "=",
      ),
    );
    return JSON.parse(json) as Partial<AuthUser>;
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(() =>
    tokenStorage.getAccessToken(),
  );
  const [user, setUser] = useState<AuthUser | null>(() => {
    const storedToken = tokenStorage.getAccessToken();
    if (!storedToken) {
      return null;
    }

    const payload = decodeTokenPayload(storedToken);
    if (!payload?.id || !payload?.email || !payload?.role) {
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      fullName: payload.fullName,
    };
  });

  useEffect(() => {
    if (token) {
      tokenStorage.setAccessToken(token);
      const payload = decodeTokenPayload(token);
      if (payload?.id && payload?.email && payload?.role) {
        setUser({
          id: payload.id,
          email: payload.email,
          role: payload.role,
          fullName: payload.fullName,
        });
      }
    }
  }, [token]);

  const logout = () => {
    tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  const login = async (data: LoginInput) => {
    const response = await api.post("/api/users/login", data);
    const nextToken = extractToken(response.data);

    if (!nextToken) {
      throw new Error("Login response did not include a token.");
    }

    tokenStorage.setAccessToken(nextToken);
    setToken(nextToken);

    const nextUser = extractUser(response.data) ?? decodeTokenPayload(nextToken);
    if (nextUser?.id && nextUser?.email && nextUser?.role) {
      setUser({
        id: nextUser.id,
        email: nextUser.email,
        role: nextUser.role,
        fullName: nextUser.fullName,
      });
    }
  };

  const register = async (data: RegisterInput) => {
    const response = await api.post("/api/users/register", data);
    const nextToken = extractToken(response.data);

    if (!nextToken) {
      throw new Error("Register response did not include a token.");
    }

    tokenStorage.setAccessToken(nextToken);
    setToken(nextToken);

    const nextUser = extractUser(response.data) ?? decodeTokenPayload(nextToken);
    if (nextUser?.id && nextUser?.email && nextUser?.role) {
      setUser({
        id: nextUser.id,
        email: nextUser.email,
        role: nextUser.role,
        fullName: nextUser.fullName,
      });
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
