
import { ArrowLeft, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Complex } from '@/types/hierarchy';

interface ComplexDetailsHeaderProps {
  complex: Complex;
}

export const ComplexDetailsHeader = ({ complex }: ComplexDetailsHeaderProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col gap-2 mb-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => navigate('/complexes')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Terug naar complexoverzicht
        </Button>
      </div>
      
      <div className="flex items-center gap-3">
        <Building2 className="h-8 w-8 text-cedrus-blue" />
        <div>
          <h1 className="text-3xl font-bold">{complex.name}</h1>
          <p className="text-muted-foreground">{complex.address}, {complex.city}</p>
        </div>
      </div>
    </div>
  );
};
