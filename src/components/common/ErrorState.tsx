
import React from 'react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Er is een fout opgetreden",
  description = "Er is een probleem opgetreden bij het laden van gegevens. Probeer het later opnieuw.",
  actionLabel = "Opnieuw proberen",
  onAction = () => window.location.reload()
}) => {
  return (
    <div className="text-center p-8 border rounded-lg bg-muted/20">
      <h3 className="text-lg font-medium mb-2 text-red-500">{title}</h3>
      <p className="text-muted-foreground mb-4">
        {description}
      </p>
      <Button onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
};
