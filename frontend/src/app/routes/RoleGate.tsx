import React from "react";
import type { AppRole } from "../providers/AuthProvider";

interface RoleGateProps {
  allowedRoles: AppRole[];
  role?: AppRole | null;
  children: React.ReactNode;
}

export function RoleGate({ allowedRoles, role, children }: RoleGateProps) {
  if (!role || !allowedRoles.includes(role)) {
    return null;
  }

  return <>{children}</>;
}
