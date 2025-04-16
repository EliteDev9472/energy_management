
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Loader } from "lucide-react";

export function RequireAuth() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 animate-spin text-cedrus-accent" />
      </div>
    );
  }

  if (!user) {
    // Redirect to the login page but save the current location
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
