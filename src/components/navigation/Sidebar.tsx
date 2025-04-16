
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Database, 
  Users2, 
  BarChart3, 
  Settings,
  ListTodo,
  Building2,
  Home
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { NavItem } from './NavItem';
import { StructureMenu } from './StructureMenu';
import { SidebarHeader } from './SidebarHeader';
import { SidebarFooter } from './SidebarFooter';
import { useAuth } from '@/hooks/useAuth';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();
  const { isAdmin, isConsultant } = useAuth();

  // Expand sidebar on location change if on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [location.pathname, isMobile]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div 
      className="h-screen fixed left-0 top-0 z-40 flex flex-col transition-all duration-300 w-full md:w-auto"
      style={{ 
        backgroundColor: '#1A1A1A',
        width: isMobile ? "100%" : (collapsed ? "70px" : "250px")
      }}
    >
      <SidebarHeader 
        collapsed={collapsed} 
        isMobile={isMobile} 
        toggleSidebar={toggleSidebar} 
      />

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            to="/" 
            collapsed={collapsed && !isMobile} 
            isActive={location.pathname === '/'}
          />
          
          <StructureMenu collapsed={collapsed} isMobile={isMobile} />
          
          <NavItem 
            icon={<Database />} 
            label="Aansluitingen" 
            to="/connections" 
            collapsed={collapsed && !isMobile}
            isActive={location.pathname.includes('/connections')}
          />
          
          <NavItem 
            icon={<ListTodo />} 
            label="Taken" 
            to="/tasks" 
            collapsed={collapsed && !isMobile}
            isActive={location.pathname.includes('/tasks')}
          />
          
          <NavItem 
            icon={<Users2 />} 
            label="Teamleden" 
            to="/team" 
            collapsed={collapsed && !isMobile}
            isActive={location.pathname.includes('/team')}
          />
          
          <NavItem 
            icon={<BarChart3 />} 
            label="Rapportages" 
            to="/reports" 
            collapsed={collapsed && !isMobile}
            isActive={location.pathname.includes('/reports')}
          />
          
          <NavItem 
            icon={<Settings />} 
            label="Instellingen" 
            to="/settings" 
            collapsed={collapsed && !isMobile}
            isActive={location.pathname.includes('/settings') || 
                     location.pathname.includes('/admin/users') || 
                     location.pathname.includes('/clients')}
          />
        </ul>
      </nav>
      
      <SidebarFooter collapsed={collapsed} isMobile={isMobile} />
    </div>
  );
}
