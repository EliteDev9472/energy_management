
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

type SubNavItemProps = {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

export function SubNavItem({ icon, label, to, isActive }: SubNavItemProps) {
  return (
    <li>
      <Link
        to={to}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-md text-white transition-colors",
          isActive ? "bg-cedrus-accent/50 text-white" : "hover:bg-white/10"
        )}
      >
        <span className="text-sm">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </Link>
    </li>
  );
}
