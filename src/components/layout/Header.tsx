
import { Bell, Search, User, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from '@/components/navigation/Sidebar';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

type HeaderProps = {
  sidebarWidth: number;
  userName?: string;
  userRole?: string;
};

export function Header({ sidebarWidth, userName = "John Doe", userRole = "Klant" }: HeaderProps) {
  const isMobile = useIsMobile();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      toast({
        title: "Zoeken",
        description: `Zoeken naar: ${searchQuery}`,
      });
      setSearchQuery('');
      // In a real app, we would navigate to search results
    }
  };

  const handleNotifications = () => {
    toast({
      title: "Notificaties",
      description: "U heeft 3 ongelezen notificaties",
    });
  };

  const handleProfile = () => {
    navigate('/settings');
  };

  const handleLogout = () => {
    toast({
      title: "Uitgelogd",
      description: "U bent succesvol uitgelogd",
    });
    // In a real app, we would handle the actual logout logic here
  };

  return (
    <header 
      className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-30 flex items-center justify-between px-2 md:px-6"
      style={{ marginLeft: isMobile ? 0 : `${sidebarWidth}px` }}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[250px]" style={{ backgroundColor: '#1A1A1A' }}>
              <Sidebar />
            </SheetContent>
          </Sheet>
        )}
        
        <div className={isMobile ? (searchOpen ? "block w-full" : "hidden") : "block relative"}>
          <form onSubmit={handleSearch}>
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Zoeken..."
              className="rounded-full bg-background h-9 w-full md:w-[250px] pl-8 pr-4 text-sm border border-input focus:border-ring focus:ring-1 focus:ring-ring focus-visible:outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onBlur={() => isMobile && setSearchOpen(false)}
            />
          </form>
        </div>
        
        {isMobile && !searchOpen && (
          <Button variant="ghost" size="icon" onClick={() => setSearchOpen(true)}>
            <Search className="h-5 w-5" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center gap-2 md:gap-3">
        <Button 
          variant="outline" 
          size="icon" 
          className="relative"
          onClick={handleNotifications}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-cedrus-accent text-[10px] font-bold flex items-center justify-center text-white">3</span>
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2" size="sm">
              <div className="h-8 w-8 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white">
                <User className="h-4 w-4" />
              </div>
              <div className="hidden md:block text-left">
                <div className="font-medium text-sm">{userName}</div>
                <div className="text-xs text-muted-foreground">{userRole}</div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Mijn Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfile}>Profiel</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings')}>Instellingen</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/settings/password')}>Wachtwoord wijzigen</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Uitloggen</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
