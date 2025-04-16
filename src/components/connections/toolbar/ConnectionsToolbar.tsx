
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, FileCog, ArrowUpDown, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { SearchBar } from "../filters/SearchBar";
import { ConnectionFilters } from "../filters/ConnectionFilters";
import { ColumnVisibility, Connection, FilterSettings } from "@/types/connection";
import { ColumnManager } from "../table/ColumnManager";
import { exportToCSV } from "@/utils/exportUtils";
import { Organization } from "@/types/hierarchy";

interface ConnectionsToolbarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: FilterSettings;
  setFilters: (filters: FilterSettings) => void;
  itemsPerPage: number;
  setItemsPerPage: (itemsPerPage: number) => void;
  uniqueSuppliers: string[];
  uniqueGridOperators: string[];
  uniqueObjectTypes: string[];
  checkForDuplicateConnections: () => void;
  columnVisibility: ColumnVisibility;
  setColumnVisibility: (visibility: ColumnVisibility) => void;
  savePreferences: () => void;
  filteredConnections: Connection[];
  organizations: Organization[];
}

export const ConnectionsToolbar = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
  itemsPerPage,
  setItemsPerPage,
  uniqueSuppliers,
  uniqueGridOperators,
  uniqueObjectTypes,
  checkForDuplicateConnections,
  columnVisibility,
  setColumnVisibility,
  savePreferences,
  filteredConnections,
  organizations
}: ConnectionsToolbarProps) => {
  
  const handleExport = () => {
    // Get array of visible column names
    const visibleColumns = Object.entries(columnVisibility)
      .filter(([_, isVisible]) => isVisible)
      .map(([column]) => column);
    
    // Special case handling for address - include city and postal code
    if (visibleColumns.includes('address')) {
      if (!visibleColumns.includes('city')) visibleColumns.push('city');
      if (!visibleColumns.includes('postalCode')) visibleColumns.push('postalCode');
    }
    
    // Export to CSV
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    exportToCSV(filteredConnections, visibleColumns, `aansluitingen-export-${timestamp}.csv`);
    
    toast({
      title: "Export gestart",
      description: `${filteredConnections.length} aansluitingen worden geëxporteerd naar CSV.`
    });
  };

  const handleSortChange = (field: 'address' | 'status' | 'plannedConnectionDate') => {
    // If already sorting by this field, toggle direction
    if (filters.sortBy === field) {
      const newDirection = filters.sortDirection === 'asc' ? 'desc' : 'asc';
      setFilters({ ...filters, sortDirection: newDirection });
    } else {
      // Otherwise, start sorting by this field in ascending order
      setFilters({ ...filters, sortBy: field, sortDirection: 'asc' });
    }
  };

  // Helper function to render sort icon
  const getSortIcon = (field: 'address' | 'status' | 'plannedConnectionDate') => {
    if (filters.sortBy !== field) return <ArrowUpDown className="h-4 w-4" />;
    return filters.sortDirection === 'asc' 
      ? <ArrowUp className="h-4 w-4" /> 
      : <ArrowDown className="h-4 w-4" />;
  };

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col space-y-4">
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          
          <div className="flex flex-wrap justify-between items-center gap-2">
            <ConnectionFilters 
              filters={filters}
              setFilters={setFilters}
              uniqueSuppliers={uniqueSuppliers}
              uniqueGridOperators={uniqueGridOperators}
              uniqueObjectTypes={uniqueObjectTypes}
              checkForDuplicateConnections={checkForDuplicateConnections}
              organizations={organizations}
            />
            
            <div className="flex flex-wrap items-center gap-2">
              {/* Sorting Controls */}
              <div className="flex items-center gap-2 mr-2">
                <span className="text-sm text-muted-foreground">Sorteren:</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => handleSortChange('address')}
                >
                  Adres {getSortIcon('address')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => handleSortChange('status')}
                >
                  Status {getSortIcon('status')}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="h-8 gap-1 text-xs"
                  onClick={() => handleSortChange('plannedConnectionDate')}
                >
                  Aansluitdatum {getSortIcon('plannedConnectionDate')}
                </Button>
              </div>
              
              <ColumnManager 
                columnVisibility={columnVisibility}
                setColumnVisibility={setColumnVisibility}
                savePreferences={savePreferences}
              />
              
              <Button variant="outline" onClick={handleExport} disabled={filteredConnections.length === 0}>
                <Download className="h-4 w-4 mr-2" /> Exporteer
              </Button>
              
              <Select 
                value={itemsPerPage.toString()} 
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Items per pagina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 per pagina</SelectItem>
                  <SelectItem value="10">10 per pagina</SelectItem>
                  <SelectItem value="20">20 per pagina</SelectItem>
                  <SelectItem value="50">50 per pagina</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
