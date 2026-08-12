import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { UserRole } from "../types/auth";

type Props = {
  children: React.ReactNode;
  role?: UserRole;
};

export default function ProtectedRoute({ children, role }: Props) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname, role }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "job-seeker" ? "/user/jobs" : "/user/applicants"} replace />;
  }

  return children;
}
