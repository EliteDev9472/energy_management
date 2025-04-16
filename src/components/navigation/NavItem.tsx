
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type NavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  collapsed: boolean;
  isActive: boolean;
}

export function NavItem({ icon, label, to, collapsed, isActive }: NavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-white transition-colors",
          isActive ? "bg-cedrus-accent text-white" : "hover:bg-white/10",
          collapsed ? "justify-center" : ""
        )}
      >
        <span className="text-sm">{icon}</span>
        {!collapsed && <span className="text-sm font-medium">{label}</span>}
      </Link>
    </li>
  );
}
