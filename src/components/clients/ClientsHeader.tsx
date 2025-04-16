
import { Building2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ClientsHeaderProps {
  onCreateOrganization: () => void;
}

export function ClientsHeader({ onCreateOrganization }: ClientsHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white mb-2 flex items-center">
          <Building2 className="mr-2 h-8 w-8" />
          Klantenbeheer
        </h1>
        <p className="text-muted-foreground">
          Beheer alle klantorganisaties en hun gebruikers.
        </p>
      </div>
      <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={onCreateOrganization}>
        <Plus className="mr-2 h-4 w-4" /> Nieuwe Organisatie
      </Button>
    </div>
  );
}
