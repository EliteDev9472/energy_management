
import { Button } from "@/components/ui/button";
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

type SidebarFooterProps = {
  collapsed: boolean;
  isMobile: boolean;
}

export function SidebarFooter({ collapsed, isMobile }: SidebarFooterProps) {
  const { signOut } = useAuth();
  
  const handleLogout = () => {
    signOut();
  };

  return (
    <div className="p-4 border-t border-white/10 mt-auto">
      <Button 
        variant="ghost" 
        className={cn(
          "w-full text-white hover:bg-white/10 flex items-center gap-3",
          collapsed && !isMobile && "justify-center"
        )}
        onClick={handleLogout}
      >
        <LogOut className="h-5 w-5" />
        {(!collapsed || isMobile) && <span>Uitloggen</span>}
      </Button>
    </div>
  );
}
