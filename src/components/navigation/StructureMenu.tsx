
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, TreePine, Building2, Building, FolderTree, FolderCog, Home, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SubNavItem } from './SubNavItem';

type StructureMenuProps = {
  collapsed: boolean;
  isMobile: boolean;
}

export function StructureMenu({ collapsed, isMobile }: StructureMenuProps) {
  const [menuOpen, setMenuOpen] = useState(true);
  const location = useLocation();
  
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Check if current path is in the structure section
  const isInStructureSection = location.pathname.includes('/organizations') || 
                             location.pathname.includes('/entities') || 
                             location.pathname.includes('/categories') ||
                             location.pathname.includes('/projects') ||
                             location.pathname.includes('/complexes') ||
                             location.pathname.includes('/objects');

  return (
    <li>
      <div 
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-white transition-colors cursor-pointer",
          isInStructureSection ? "bg-cedrus-accent text-white" : "hover:bg-white/10",
          collapsed && !isMobile ? "justify-center" : ""
        )}
        onClick={collapsed && !isMobile ? null : toggleMenu}
      >
        {collapsed && !isMobile ? (
          <Link to="/organizations" className="text-sm">
            <TreePine />
          </Link>
        ) : (
          <>
            <TreePine className="text-sm" />
            <span className="text-sm font-medium flex-1">Structuur</span>
            <ChevronDown 
              className={cn(
                "h-4 w-4 transition-transform",
                menuOpen ? "transform rotate-180" : ""
              )}
            />
          </>
        )}
      </div>
      
      {!collapsed && menuOpen && (
        <ul className="mt-1 ml-4 space-y-1">
          <SubNavItem 
            icon={<Building2 />}
            label="Organisaties" 
            to="/organizations" 
            isActive={location.pathname.includes('/organizations')}
          />
          <SubNavItem 
            icon={<Building />}
            label="Entiteiten" 
            to="/entities" 
            isActive={location.pathname.includes('/entities')}
          />
          <SubNavItem 
            icon={<FolderTree />}
            label="Categorieën" 
            to="/categories" 
            isActive={location.pathname.includes('/categories')}
          />
          <SubNavItem 
            icon={<FolderCog />}
            label="Projecten" 
            to="/projects" 
            isActive={location.pathname.includes('/projects')}
          />
          <SubNavItem 
            icon={<Warehouse />}
            label="Complexen" 
            to="/complexes" 
            isActive={location.pathname.includes('/complexes')}
          />
          <SubNavItem 
            icon={<Home />}
            label="Objecten" 
            to="/objects" 
            isActive={location.pathname.includes('/objects')}
          />
        </ul>
      )}
    </li>
  );
}
