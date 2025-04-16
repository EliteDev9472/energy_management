
import { ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/user";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

interface RoleGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
  fallback?: ReactNode;
}

export function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const { hasRole, loading } = useAuth();
  
  if (loading) {
    return null;
  }
  
  if (hasRole(allowedRoles)) {
    return <>{children}</>;
  }
  
  if (fallback) {
    return <>{fallback}</>;
  }
  
  return (
    <Alert variant="destructive">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Toegang geweigerd</AlertTitle>
      <AlertDescription>
        U heeft niet de benodigde rechten om deze inhoud te bekijken.
      </AlertDescription>
    </Alert>
  );
}
