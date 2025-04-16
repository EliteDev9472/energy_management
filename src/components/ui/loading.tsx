
import { Loader2 } from 'lucide-react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  center?: boolean;
  text?: string;
}

export function Loading({ size = 'md', center = true, text = 'Laden...' }: LoadingProps) {
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const spinner = (
    <div className="flex items-center gap-2">
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary`} />
      {text && <span className="text-muted-foreground">{text}</span>}
    </div>
  );

  if (center) {
    return (
      <div className="flex justify-center items-center py-8">
        {spinner}
      </div>
    );
  }

  return spinner;
}
