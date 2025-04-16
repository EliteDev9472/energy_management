
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from 'lucide-react';

type SidebarHeaderProps = {
  collapsed: boolean;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export function SidebarHeader({ collapsed, isMobile, toggleSidebar }: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-white/10">
      {collapsed && !isMobile ? (
        <img 
          src="/lovable-uploads/47ca85c7-de00-49d4-9720-10f6b39476bd.png" 
          alt="Cedrus" 
          className="h-8 w-8 mx-auto" 
        />
      ) : (
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/c04a5009-3b69-4563-bb98-928f73023179.png" 
            alt="Cedrus Energy" 
            className="h-8" 
          />
        </div>
      )}
      {!isMobile && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleSidebar} 
          className="text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      )}
    </div>
  );
}
