import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth, type AppRole } from "../providers/AuthProvider";

interface ProtectedRouteProps {
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
