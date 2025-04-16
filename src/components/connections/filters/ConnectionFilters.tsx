
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Filter } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { FilterSettings } from "@/types/connection";
import { Organization } from "@/types/hierarchy";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

interface ConnectionFiltersProps {
  filters: FilterSettings;
  setFilters: (filters: FilterSettings) => void;
  uniqueSuppliers: string[];
  uniqueGridOperators: string[];
  uniqueObjectTypes: string[];
  checkForDuplicateConnections: () => void;
  organizations: Organization[];
}

export const ConnectionFilters = ({
  filters,
  setFilters,
  uniqueSuppliers,
  uniqueGridOperators,
  uniqueObjectTypes,
  checkForDuplicateConnections,
  organizations
}: ConnectionFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<string>("");

  const activeFiltersCount = Object.values(filters).filter(value => 
    value !== '' && value !== null && value !== undefined && value.length !== 0
  ).length;
  
  const handleFilterChange = (key: keyof FilterSettings, value: string | boolean | null) => {
    if (key === 'type' || key === 'status' || key === 'supplier' || key === 'gridOperator') {
      // For array values, we create a new array with a single value
      setFilters({ ...filters, [key]: [value as string] });
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  const handleOrganizationSelect = (organizationId: string) => {
    setSelectedOrganization(organizationId);
    // In a real implementation, this would filter connections by organization
    // Here we just set the organization filter to demonstrate the UI
    setFilters({ ...filters, organizationId });
  };

  const clearAllFilters = () => {
    setFilters({
      type: [],
      status: [],
      supplier: [],
      gridOperator: [],
      hasActiveContract: null,
      objectType: '',
      sortBy: 'address',
      sortDirection: 'asc',
      organizationId: null,
      entityId: null,
      categoryId: null,
      projectId: null,
      onlyProblems: false,
      dateRange: null
    });
    setSelectedOrganization("");
  };

  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-2 rounded-full">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[340px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Zoek filter..." />
            <CommandList>
              <CommandEmpty>Geen filters gevonden.</CommandEmpty>
              
              <CommandGroup heading="Type">
                <CommandItem 
                  onSelect={() => handleFilterChange('type', 'Elektriciteit')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.type.includes('Elektriciteit') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Elektriciteit
                </CommandItem>
                <CommandItem 
                  onSelect={() => handleFilterChange('type', 'Gas')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.type.includes('Gas') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Gas
                </CommandItem>
                <CommandItem 
                  onSelect={() => handleFilterChange('type', 'Warmte')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.type.includes('Warmte') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Warmte
                </CommandItem>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Status">
                <CommandItem 
                  onSelect={() => handleFilterChange('status', 'Actief')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.status.includes('Actief') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Actief
                </CommandItem>
                <CommandItem 
                  onSelect={() => handleFilterChange('status', 'In aanvraag')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.status.includes('In aanvraag') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  In aanvraag
                </CommandItem>
                <CommandItem 
                  onSelect={() => handleFilterChange('status', 'Inactief')}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.status.includes('Inactief') ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Inactief
                </CommandItem>
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Leverancier">
                {uniqueSuppliers.map((supplier) => (
                  <CommandItem 
                    key={supplier}
                    onSelect={() => handleFilterChange('supplier', supplier)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${filters.supplier.includes(supplier) ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {supplier}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Netbeheerder">
                {uniqueGridOperators.map((operator) => (
                  <CommandItem 
                    key={operator}
                    onSelect={() => handleFilterChange('gridOperator', operator)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${filters.gridOperator.includes(operator) ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {operator}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Organisatie">
                {organizations.map((org) => (
                  <CommandItem 
                    key={org.id}
                    onSelect={() => handleOrganizationSelect(org.id)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${selectedOrganization === org.id ? 'opacity-100' : 'opacity-0'}`}
                    />
                    {org.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              
              <CommandSeparator />
              
              <CommandGroup heading="Contract">
                <CommandItem 
                  onSelect={() => setFilters({ ...filters, hasActiveContract: true })}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.hasActiveContract === true ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Actief contract
                </CommandItem>
                <CommandItem 
                  onSelect={() => setFilters({ ...filters, hasActiveContract: false })}
                  className="cursor-pointer"
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${filters.hasActiveContract === false ? 'opacity-100' : 'opacity-0'}`}
                  />
                  Geen actief contract
                </CommandItem>
              </CommandGroup>
              
              <CommandSeparator />
              
              <div className="p-2">
                <div className="flex justify-between">
                  <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                    Wis filters
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={checkForDuplicateConnections}
                  >
                    Controleer dubbele aansluitingen
                  </Button>
                </div>
              </div>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};
