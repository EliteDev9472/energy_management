
import React from 'react';

interface LoadingStateProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  size = 'medium', 
  color = 'border-cedrus-accent' 
}) => {
  const sizeMap = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  return (
    <div className="flex justify-center py-4">
      <div className={`animate-spin rounded-full ${sizeMap[size]} border-b-2 ${color}`}></div>
    </div>
  );
};
