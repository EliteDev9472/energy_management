
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Connection, ColumnVisibility } from "@/types/connection";
import { ConnectionsTableRow } from "./ConnectionsTableRow";
import { useState, useRef, useEffect } from "react";

interface ConnectionsTableProps {
  displayedConnections: Connection[];
  resetFilters: () => void;
  columnVisibility: ColumnVisibility;
  onConnectionClick: (connectionId: string) => void;
  onConnectionDeleted?: () => void;
}

export const ConnectionsTable = ({ 
  displayedConnections,
  resetFilters,
  columnVisibility,
  onConnectionClick,
  onConnectionDeleted
}: ConnectionsTableProps) => {
  const [selectedConnections, setSelectedConnections] = useState<string[]>([]);
  const checkboxRef = useRef<HTMLButtonElement>(null);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      // Select all connections
      const allConnectionIds = displayedConnections.map(connection => connection.id);
      setSelectedConnections(allConnectionIds);
    } else {
      // Deselect all connections
      setSelectedConnections([]);
    }
  };
  
  const handleSelectConnection = (connectionId: string, checked: boolean) => {
    if (checked) {
      setSelectedConnections(prev => [...prev, connectionId]);
    } else {
      setSelectedConnections(prev => prev.filter(id => id !== connectionId));
    }
  };
  
  const isAllSelected = displayedConnections.length > 0 && 
    selectedConnections.length === displayedConnections.length;
    
  const isPartiallySelected = selectedConnections.length > 0 && 
    selectedConnections.length < displayedConnections.length;
  
  // Set indeterminate state using useEffect and data attribute
  useEffect(() => {
    if (checkboxRef.current) {
      // We can't set indeterminate directly on the HTML element
      // Instead, we can use data-state attribute that the Checkbox component uses
      if (isPartiallySelected) {
        checkboxRef.current.setAttribute('data-state', 'indeterminate');
      } else {
        checkboxRef.current.setAttribute('data-state', isAllSelected ? 'checked' : 'unchecked');
      }
    }
  }, [isPartiallySelected, isAllSelected]);
  
  return (
    <div className="bg-white rounded-md border overflow-hidden mb-6">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox 
                  id="select-all" 
                  checked={isAllSelected}
                  ref={checkboxRef}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              {columnVisibility.ean && <TableHead>EAN</TableHead>}
              {columnVisibility.address && <TableHead>Adres</TableHead>}
              {columnVisibility.type && <TableHead>Type</TableHead>}
              {columnVisibility.status && <TableHead>Status</TableHead>}
              {columnVisibility.supplier && <TableHead>Leverancier</TableHead>}
              {columnVisibility.object && <TableHead>Object</TableHead>}
              {columnVisibility.gridOperator && <TableHead>Netbeheerder</TableHead>}
              {columnVisibility.hasFeedback && <TableHead>Teruglevering</TableHead>}
              {columnVisibility.plannedConnectionDate && <TableHead>Geplande Aansluitdatum</TableHead>}
              {columnVisibility.actions && <TableHead className="text-right">Acties</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedConnections.map((connection) => (
              <ConnectionsTableRow 
                key={connection.id}
                connection={connection}
                columnVisibility={columnVisibility}
                onConnectionClick={onConnectionClick}
                onDelete={onConnectionDeleted}
                isSelected={selectedConnections.includes(connection.id)}
                onSelect={handleSelectConnection}
              />
            ))}
            {displayedConnections.length === 0 && (
              <TableRow>
                <TableCell colSpan={Object.values(columnVisibility).filter(Boolean).length + 1} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-muted-foreground mb-2">Geen aansluitingen gevonden die aan de criteria voldoen.</p>
                    <Button 
                      variant="outline" 
                      onClick={resetFilters} 
                      className="mt-2"
                    >
                      Reset filters
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
