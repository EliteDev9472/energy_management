
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Settings, FileText, ListTodo, Users, Building2, UserCog } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { USER_ROLE_LABELS } from "@/types/user";

export function HeaderActions() {
  const { user, userProfile, signOut, isAdmin, isConsultant } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = () => {
    signOut();
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleTasks = () => {
    navigate("/tasks");
  };

  const handleDocuments = () => {
    navigate("/documents");
  };

  const handleSettings = () => {
    navigate("/settings");
  };

  const handleUserManagement = () => {
    navigate("/admin/users");
  };

  const handleClientManagement = () => {
    navigate("/clients");
  };

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2 h-9 px-2">
          <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:block text-left">
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">{userProfile?.name || user.email}</div>
              {userProfile && (
                <Badge className="bg-cedrus-accent text-xs">
                  {USER_ROLE_LABELS[userProfile.role]}
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Mijn Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfile}>
          <User className="mr-2 h-4 w-4" />
          <span>Profiel</span>
        </DropdownMenuItem>
        
        {isAdmin() && (
          <DropdownMenuItem onClick={handleUserManagement}>
            <UserCog className="mr-2 h-4 w-4" />
            <span>Gebruikersbeheer</span>
          </DropdownMenuItem>
        )}
        
        {(isAdmin() || isConsultant()) && (
          <DropdownMenuItem onClick={handleClientManagement}>
            <Building2 className="mr-2 h-4 w-4" />
            <span>Klantenbeheer</span>
          </DropdownMenuItem>
        )}
        
        <DropdownMenuItem onClick={handleTasks}>
          <ListTodo className="mr-2 h-4 w-4" />
          <span>Mijn Taken</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDocuments}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Documenten</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Instellingen</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Uitloggen</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
