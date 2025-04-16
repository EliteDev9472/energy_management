import { PageLayout } from '@/components/layout/PageLayout';
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ColumnVisibility, ConnectionPreferences, Connection, FilterSettings, defaultColumnVisibility } from '@/types/connection';
import { filterConnections, getUniqueValues } from '@/utils/connectionUtils';
import { ConnectionsHeader } from '@/components/connections/header/ConnectionsHeader';
import { ConnectionsToolbar } from '@/components/connections/toolbar/ConnectionsToolbar';
import { HealthWarning } from '@/components/connections/HealthWarning';
import { ConnectionsTable } from '@/components/connections/table/ConnectionsTable';
import { ConnectionsPagination } from '@/components/connections/pagination/ConnectionsPagination';
import { loadConnectionPreferences, saveConnectionPreferences } from '@/utils/preferencesUtils';
import { useLocation, useNavigate } from 'react-router-dom';
import { Organization } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchyService';
import { connectionService } from '@/services/connections/connectionService';

export default function ConnectionsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showHealthWarnings, setShowHealthWarnings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [preferences, setPreferences] = useState<ConnectionPreferences>(() => loadConnectionPreferences());
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(preferences.columnVisibility || defaultColumnVisibility);
  const [itemsPerPage, setItemsPerPage] = useState(preferences.itemsPerPage || 5);
  
  const [filters, setFilters] = useState<FilterSettings>({
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

  const loadConnections = async () => {
    try {
      setLoading(true);
      const connectionsData = await connectionService.getConnections();
      setConnections(connectionsData);
    } catch (error) {
      console.error('Error loading connections:', error);
      toast({
        title: "Error loading connections",
        description: "There was a problem loading the connections. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadOrganizations = async () => {
    try {
      const organizationsData = await hierarchyService.getOrganizations();
      setOrganizations(organizationsData);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast({
        title: "Error loading organizations",
        description: "There was a problem loading the organizations. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadConnections();
    loadOrganizations();
  }, []);

  const savePreferences = () => {
    const newPreferences: ConnectionPreferences = {
      columnVisibility,
      itemsPerPage
    };
    saveConnectionPreferences(newPreferences);
    setPreferences(newPreferences);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, searchQuery, itemsPerPage]);

  useEffect(() => {
    const timer = setTimeout(() => {
      savePreferences();
    }, 1000); // Debounce save operation
    
    return () => clearTimeout(timer);
  }, [itemsPerPage, columnVisibility]);

  const { uniqueSuppliers, uniqueGridOperators, uniqueObjectTypes } = getUniqueValues(connections);

  const filteredConnections = filterConnections(connections, searchQuery, filters);

  const totalPages = Math.ceil(filteredConnections.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedConnections = filteredConnections.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
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
    toast({
      title: "Filters gereset",
      description: "Alle filters zijn verwijderd."
    });
  };

  const checkForDuplicateConnections = () => {
    toast({
      title: "Verbindingscontrole",
      description: "Er zijn 2 mogelijke dubbele aansluitingen gevonden binnen dezelfde organisatie.",
      variant: "destructive"
    });
    setShowHealthWarnings(true);
  };

  const handleConnectionDeleted = () => {
    loadConnections();
  };

  const handleConnectionClick = (connectionId: string) => {
    navigate(`/connections/${connectionId}`);
  };

  const handleNewConnection = () => {
    navigate('/connections/new');
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <ConnectionsHeader onNewConnection={handleNewConnection} />
        
        <ConnectionsToolbar 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filters={filters}
          setFilters={setFilters}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          uniqueSuppliers={uniqueSuppliers}
          uniqueGridOperators={uniqueGridOperators}
          uniqueObjectTypes={uniqueObjectTypes}
          checkForDuplicateConnections={checkForDuplicateConnections}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          savePreferences={savePreferences}
          filteredConnections={filteredConnections}
          organizations={organizations}
        />

        {showHealthWarnings && (
          <HealthWarning onHide={() => setShowHealthWarnings(false)} />
        )}

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Aansluitingen laden...</p>
            </div>
          </div>
        ) : (
          <>
            <ConnectionsTable 
              displayedConnections={displayedConnections}
              resetFilters={resetFilters}
              columnVisibility={columnVisibility}
              onConnectionClick={handleConnectionClick}
              onConnectionDeleted={handleConnectionDeleted}
            />
            
            {filteredConnections.length > itemsPerPage && (
              <ConnectionsPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
