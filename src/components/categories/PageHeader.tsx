
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description: string;
  backUrl: string;
  backLabel?: string;
}

export const PageHeader = ({ 
  title, 
  description, 
  backUrl, 
  backLabel = 'Terug' 
}: PageHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-4 mb-6">
      <Button variant="ghost" onClick={() => navigate(backUrl)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> {backLabel}
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">{title}</h1>
        <p className="text-muted-foreground mt-1">
          {description}
        </p>
      </div>
    </div>
  );
};
