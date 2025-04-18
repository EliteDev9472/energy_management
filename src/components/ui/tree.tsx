
import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeProps {
  children: React.ReactNode;
  className?: string;
}

export function Tree({ children, className }: TreeProps) {
  return (
    <div className={cn("space-y-1", className)}>
      {children}
    </div>
  );
}

interface TreeNodeProps {
  id: string;
  label: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  isLeaf?: boolean;
  className?: string;
  defaultExpanded?: boolean;
}

export function TreeNode({
  id,
  label,
  icon,
  children,
  isLeaf = false,
  className,
  defaultExpanded = false
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasChildren = Boolean(children);

  const handleToggle = () => {
    if (hasChildren) {
      setExpanded(prev => !prev);
    }
  };

  return (
    <div className={cn("", className)}>
      <div
        className={cn(
          "flex items-center py-1 px-2 rounded-md hover:bg-muted/50 cursor-pointer",
          hasChildren && expanded && "font-medium"
        )}
        onClick={handleToggle}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
          )
        ) : (
          <div className="w-4 h-4 mr-1" />
        )}
        {icon && <span className="mr-2">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>

      {hasChildren && expanded && (
        <div className="pl-6 border-l border-dashed border-muted ml-2 mt-1 space-y-1">
          {children}
        </div>
      )}
    </div>
  );
}
