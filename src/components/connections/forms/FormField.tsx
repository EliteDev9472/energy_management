
import { ReactNode } from 'react';
import { Label } from '@/components/ui/label';

interface FormFieldProps {
  label: string;
  htmlFor: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function FormField({ label, htmlFor, children, icon }: FormFieldProps) {
  return (
    <div>
      <div className="flex items-center gap-2">
        {icon}
        <Label htmlFor={htmlFor}>{label}</Label>
      </div>
      {children}
    </div>
  );
}
