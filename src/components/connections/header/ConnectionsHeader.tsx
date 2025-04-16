
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface ConnectionsHeaderProps {
  onNewConnection: () => void;
}

export const ConnectionsHeader = ({ onNewConnection }: ConnectionsHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Aansluitingen</h1>
        <p className="text-muted-foreground mt-1">
          Beheer al uw energieaansluitingen op één plek
        </p>
      </div>
      
      <Button onClick={onNewConnection} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
        <Plus className="mr-2 h-4 w-4" /> Nieuwe aansluiting
      </Button>
    </div>
  );
};
