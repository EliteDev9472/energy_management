
import { useState } from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { ColumnVisibility, defaultColumnVisibility } from '@/types/connection';
import { toast } from '@/hooks/use-toast';

interface ColumnManagerProps {
  columnVisibility: ColumnVisibility;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  savePreferences: () => void;
}

export function ColumnManager({ columnVisibility, setColumnVisibility, savePreferences }: ColumnManagerProps) {
  const [tempVisibility, setTempVisibility] = useState<ColumnVisibility>(columnVisibility);

  const toggleColumn = (column: keyof ColumnVisibility) => {
    const newVisibility = { ...tempVisibility, [column]: !tempVisibility[column] };
    // Ensure at least one column is always visible
    if (Object.values(newVisibility).some(value => value)) {
      setTempVisibility(newVisibility);
      setColumnVisibility(newVisibility);
    } else {
      toast({
        title: "Operatie niet toegestaan",
        description: "Er moet minimaal één kolom zichtbaar zijn",
        variant: "destructive"
      });
    }
  };

  const resetToDefault = () => {
    setTempVisibility(defaultColumnVisibility);
    setColumnVisibility(defaultColumnVisibility);
    toast({
      title: "Standaardinstellingen hersteld",
      description: "Kolomweergave is teruggezet naar standaard"
    });
  };

  const handleSavePreferences = () => {
    savePreferences();
    toast({
      title: "Voorkeuren opgeslagen",
      description: "Uw kolomvoorkeuren zijn opgeslagen"
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Kolommen
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Zichtbare kolommen</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={tempVisibility.ean}
          onCheckedChange={() => toggleColumn('ean')}
        >
          EAN
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.address}
          onCheckedChange={() => toggleColumn('address')}
        >
          Adres
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.type}
          onCheckedChange={() => toggleColumn('type')}
        >
          Type
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.status}
          onCheckedChange={() => toggleColumn('status')}
        >
          Status
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.supplier}
          onCheckedChange={() => toggleColumn('supplier')}
        >
          Leverancier
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.object}
          onCheckedChange={() => toggleColumn('object')}
        >
          Object
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.gridOperator}
          onCheckedChange={() => toggleColumn('gridOperator')}
        >
          Netbeheerder
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.capacity}
          onCheckedChange={() => toggleColumn('capacity')}
        >
          Capaciteit
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.hasFeedback}
          onCheckedChange={() => toggleColumn('hasFeedback')}
        >
          Teruglevering
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.plannedConnectionDate}
          onCheckedChange={() => toggleColumn('plannedConnectionDate')}
        >
          Geplande Aansluitdatum
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={tempVisibility.actions}
          onCheckedChange={() => toggleColumn('actions')}
        >
          Acties
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <div className="flex justify-between px-2 py-1.5">
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            Standaard
          </Button>
          <Button variant="default" size="sm" onClick={handleSavePreferences}>
            Opslaan
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
