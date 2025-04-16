import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Status, StatusGroup } from '@/components/status/Status';
import { ConnectionCard } from '@/components/connections/ConnectionCard';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { energyConnectionService } from '@/services/connections/energyConnectionService';

// Interface for pipeline connection data
interface PipelineConnection {
  id: string;
  type: string;
  status: string;
  gridOperator?: string;
  grid_operator?: string;
  address: string;
  city: string;
  organization?: string;
  entity?: string;
  project_id?: string;
  object?: string;
  ean?: string;
  request_date: string;
  planned_connection_date?: string;
  desired_connection_date?: string;
}

interface EnergyConnectionPipelineProps {
  projectId?: string;
  connections?: any[];
  setConnections?: (connections: any[]) => void;
}

// Component to display energy connections in a pipeline view
function EnergyConnectionPipeline({
  projectId,
  connections: externalConnections,
  setConnections: setExternalConnections
}: EnergyConnectionPipelineProps) {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [connections, setInternalConnections] = useState<PipelineConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const isExternallyControlled = !!externalConnections && !!setExternalConnections;

  // Fetch connections from the API if not externally provided
  useEffect(() => {
    if (isExternallyControlled) {
      // Use the connections provided via props
      setInternalConnections(externalConnections || []);
      setIsLoading(false);
      return;
    }

    const fetchConnections = async () => {
      setIsLoading(true);
      try {
        let data;
        if (projectId) {
          data = await energyConnectionService.getEnergyConnectionsByProjectId(projectId);
        } else {
          data = await energyConnectionService.getEnergyConnections();
        }
        setInternalConnections(data);
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast({
          title: 'Fout bij ophalen aansluitingen',
          description: 'Er is een fout opgetreden bij het ophalen van de aansluitingen.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [projectId, externalConnections, isExternallyControlled]);

  // Filter connections based on active tab and search query
  const filteredConnections = useMemo(() => {
    // First, filter by tab
    let filtered = connections;
    if (activeTab !== 'all') {
      filtered = connections.filter(c => {
        switch (activeTab) {
          case 'new':
            return c.status === 'NEW';
          case 'in_progress':
            return c.status === 'IN_PROGRESS';
          case 'completed':
            return c.status === 'COMPLETED';
          case 'offer_sent':
            return c.status === 'OFFER_SENT';
          case 'offer_accepted':
            return c.status === 'OFFER_ACCEPTED';
          default:
            return true;
        }
      });
    }
    
    // Then, filter by search query if provided
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(c => 
        c.address.toLowerCase().includes(query) ||
        c.city.toLowerCase().includes(query) ||
        (c.organization && c.organization.toLowerCase().includes(query)) ||
        (c.ean && c.ean.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [connections, activeTab, searchQuery]);

  // Group connections by status for Kanban view
  const groupedConnections = useMemo(() => {
    const groups: Record<string, PipelineConnection[]> = {
      'NEW': [],
      'IN_PROGRESS': [],
      'OFFER_SENT': [],
      'OFFER_ACCEPTED': [],
      'COMPLETED': [],
    };
    
    filteredConnections.forEach(connection => {
      if (connection.status in groups) {
        groups[connection.status].push(connection);
      }
    });
    
    return groups;
  }, [filteredConnections]);

  // Handle connection click
  const handleCardClick = (connectionId: string) => {
    navigate(`/connections/${connectionId}`);
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and filter bar */}
      <div className="relative mb-6">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Zoek op adres, plaats, organisatie of EAN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {/* View tabs */}
      <Tabs defaultValue="all" onValueChange={setActiveTab} value={activeTab}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="all">Alles</TabsTrigger>
          <TabsTrigger value="new">Nieuw</TabsTrigger>
          <TabsTrigger value="in_progress">In Behandeling</TabsTrigger>
          <TabsTrigger value="offer_sent">Offerte Verstuurd</TabsTrigger>
          <TabsTrigger value="offer_accepted">Offerte Geaccepteerd</TabsTrigger>
          <TabsTrigger value="completed">Afgerond</TabsTrigger>
        </TabsList>

        {/* List view */}
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {filteredConnections.length === 0 ? (
              <div className="text-center p-8 border rounded-md">
                <p className="text-muted-foreground">Geen aansluitingen gevonden</p>
              </div>
            ) : (
              filteredConnections.map(connection => (
                <Card 
                  key={connection.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleCardClick(connection.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{connection.address}, {connection.city}</h3>
                        {connection.organization && (
                          <p className="text-sm text-muted-foreground">
                            {connection.organization}
                            {connection.entity && ` - ${connection.entity}`}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1">
                          {connection.ean ? `EAN: ${connection.ean}` : 'Geen EAN'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Status status={connection.status} />
                        <span className="text-xs font-medium text-muted-foreground">
                          {connection.gridOperator || connection.grid_operator || 'Onbekend'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        {/* Kanban view for individual status tabs */}
        {['new', 'in_progress', 'offer_sent', 'offer_accepted', 'completed'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="mt-4">
            <div className="space-y-4">
              {groupedConnections[tabValue.toUpperCase()]?.length === 0 ? (
                <div className="text-center p-8 border rounded-md">
                  <p className="text-muted-foreground">Geen aansluitingen gevonden met deze status</p>
                </div>
              ) : (
                groupedConnections[tabValue.toUpperCase()]?.map(connection => (
                  <ConnectionCard 
                    key={connection.id}
                    connection={connection}
                    onClick={() => handleCardClick(connection.id)}
                  />
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Kanban board (always visible) */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Aansluitingen Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* New */}
          <StatusGroup 
            title="Nieuw" 
            status="NEW"
            count={groupedConnections['NEW'].length}
          >
            {groupedConnections['NEW'].map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
                onClick={() => handleCardClick(connection.id)}
                compact
              />
            ))}
          </StatusGroup>

          {/* In Progress */}
          <StatusGroup 
            title="In Behandeling" 
            status="IN_PROGRESS"
            count={groupedConnections['IN_PROGRESS'].length}
          >
            {groupedConnections['IN_PROGRESS'].map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
                onClick={() => handleCardClick(connection.id)}
                compact
              />
            ))}
          </StatusGroup>

          {/* Offer Sent */}
          <StatusGroup 
            title="Offerte Verstuurd" 
            status="OFFER_SENT"
            count={groupedConnections['OFFER_SENT'].length}
          >
            {groupedConnections['OFFER_SENT'].map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
                onClick={() => handleCardClick(connection.id)}
                compact
              />
            ))}
          </StatusGroup>

          {/* Offer Accepted */}
          <StatusGroup 
            title="Offerte Geaccepteerd" 
            status="OFFER_ACCEPTED"
            count={groupedConnections['OFFER_ACCEPTED'].length}
          >
            {groupedConnections['OFFER_ACCEPTED'].map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
                onClick={() => handleCardClick(connection.id)}
                compact
              />
            ))}
          </StatusGroup>

          {/* Completed */}
          <StatusGroup 
            title="Afgerond" 
            status="COMPLETED"
            count={groupedConnections['COMPLETED'].length}
          >
            {groupedConnections['COMPLETED'].map(connection => (
              <ConnectionCard 
                key={connection.id}
                connection={connection}
                onClick={() => handleCardClick(connection.id)}
                compact
              />
            ))}
          </StatusGroup>
        </div>
      </div>
    </div>
  );
}

// Add default export
export default EnergyConnectionPipeline;

// Also keep the named export for any components that might be using it
export { EnergyConnectionPipeline };
