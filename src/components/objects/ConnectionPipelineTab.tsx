
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { Status } from '@/components/status/Status';
import { Flame, Plus, Zap, FileText, Mailbox, Send, Check, CheckCircle } from 'lucide-react';

interface ConnectionPipelineTabProps {
  objectId: string;
  objectName: string;
  projectId?: string;
}

interface ConnectionRequest {
  id: string;
  address: string;
  city: string;
  postal_code: string;
  type: string;
  status: string;
  grid_operator: string;
  request_date: string;
  desired_connection_date: string;
  ean: string;
  connection_date?: string;
  object_id: string;
  object_name: string;
  capacity: string;
}

export const ConnectionPipelineTab = ({ objectId, objectName, projectId }: ConnectionPipelineTabProps) => {
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'connections' | 'contracts'>('connections');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConnectionRequests = async () => {
      setIsLoading(true);
      try {
        // Fetch real connection requests from the database
        const { data, error } = await supabase
          .from('connection_requests')
          .select('*')
          .eq('object_id', objectId);
          
        if (error) {
          throw error;
        }
        
        setConnectionRequests(data || []);
      } catch (error) {
        console.error('Error fetching connection requests:', error);
        toast({
          title: 'Fout bij ophalen aansluitingsaanvragen',
          description: 'Er is een fout opgetreden bij het ophalen van de aansluitingsaanvragen.',
          variant: 'destructive',
        });
        // Fallback to mock data if real data fails
        const mockRequests: ConnectionRequest[] = [
          {
            id: `mock-req-1-${objectId}`,
            address: objectName,
            city: 'Amsterdam',
            postal_code: '1011XY',
            type: 'electricity',
            status: 'aangesloten',
            grid_operator: 'Liander',
            request_date: new Date().toISOString(),
            desired_connection_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            ean: '871687167261534600',
            connection_date: new Date().toISOString(),
            object_id: objectId,
            object_name: objectName,
            capacity: '3x25A'
          },
          {
            id: `mock-req-2-${objectId}`,
            address: objectName,
            city: 'Amsterdam',
            postal_code: '1011XY',
            type: 'gas',
            status: 'aangesloten',
            grid_operator: 'Stedin',
            request_date: new Date().toISOString(),
            desired_connection_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
            ean: '871687167261598700',
            connection_date: new Date().toISOString(),
            object_id: objectId,
            object_name: objectName,
            capacity: 'G4'
          }
        ];
        setConnectionRequests(mockRequests);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnectionRequests();
  }, [objectId, objectName, projectId]);

  const handleCreateConnection = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId || ''}`);
  };

  const handleViewConnection = (connectionId: string) => {
    navigate(`/connections/${connectionId}`);
  };

  const handleContractRequest = () => {
    setActiveTab('contracts');
  };

  const handleConnectionRequest = () => {
    setActiveTab('connections');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <h2 className="text-2xl font-semibold">Aansluitingen voor {objectName}</h2>
          <div className="flex space-x-6 mt-4">
            <button 
              className={`pb-2 text-sm font-medium ${activeTab === 'connections' ? 'border-b-2 border-cedrus-accent text-cedrus-accent' : 'text-muted-foreground'}`}
              onClick={handleConnectionRequest}
            >
              Aansluitingen
            </button>
            <button 
              className={`pb-2 text-sm font-medium ${activeTab === 'contracts' ? 'border-b-2 border-cedrus-accent text-cedrus-accent' : 'text-muted-foreground'}`}
              onClick={handleContractRequest}
            >
              Energiecontract aanvragen
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCreateConnection}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe aansluiting
          </Button>
        </div>
      </div>

      {activeTab === 'connections' && (
        <ConnectionsBoard 
          objectId={objectId} 
          objectName={objectName} 
          isLoading={isLoading} 
          handleCreateConnection={handleCreateConnection}
        />
      )}

      {activeTab === 'contracts' && (
        <ContractsBoard 
          objectId={objectId} 
          objectName={objectName} 
          connectionRequests={connectionRequests} 
          isLoading={isLoading} 
          handleViewConnection={handleViewConnection}
          handleCreateConnection={handleCreateConnection}
        />
      )}
    </div>
  );
};

interface ConnectionsBoardProps {
  objectId: string;
  objectName: string;
  isLoading: boolean;
  handleCreateConnection: () => void;
}

const ConnectionsBoard = ({ objectId, objectName, isLoading, handleCreateConnection }: ConnectionsBoardProps) => {
  const statusColumns = [
    { id: 'new', label: 'Nieuwe aanvraag', color: 'bg-blue-50', count: 0 },
    { id: 'in_progress', label: 'In behandeling', color: 'bg-yellow-50', count: 0 },
    { id: 'accepted', label: 'Offerte geaccepteerd', color: 'bg-purple-50', count: 0 },
    { id: 'planned', label: 'Gepland', color: 'bg-indigo-50', count: 0 },
    { id: 'execution', label: 'Uitvoering', color: 'bg-amber-50', count: 0 },
    { id: 'connected', label: 'Aangesloten', color: 'bg-green-50', count: 0 },
    { id: 'contract_request', label: 'Contract aanvragen', color: 'bg-cyan-50', count: 0 }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
      {statusColumns.map((column) => (
        <div key={column.id} className={`${column.color} rounded-md border p-3 h-full min-h-[200px]`}>
          <div className="font-medium mb-3 flex justify-between">
            {column.label}
            <Badge variant="outline">{column.count}</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface ContractsBoardProps {
  objectId: string;
  objectName: string;
  connectionRequests: ConnectionRequest[];
  isLoading: boolean;
  handleViewConnection: (id: string) => void;
  handleCreateConnection: () => void;
}

const ContractsBoard = ({ 
  objectId, 
  objectName, 
  connectionRequests, 
  isLoading, 
  handleViewConnection, 
  handleCreateConnection 
}: ContractsBoardProps) => {
  const statusColumns = [
    { id: 'register', label: 'Aanmelden', color: 'bg-blue-50', icon: <Mailbox className="h-4 w-4 mr-2" /> },
    { id: 'submitted', label: 'Ingediend', color: 'bg-yellow-50', icon: <Send className="h-4 w-4 mr-2" /> },
    { id: 'active', label: 'Actief', color: 'bg-green-50', icon: <Check className="h-4 w-4 mr-2" /> },
    { id: 'unregister', label: 'Afmelden', color: 'bg-orange-50', icon: <FileText className="h-4 w-4 mr-2" /> },
    { id: 'ended', label: 'Beëindigd', color: 'bg-red-50', icon: <CheckCircle className="h-4 w-4 mr-2" /> }
  ];

  // Filter connections by status
  const getConnectionsByStatus = (status: string) => {
    return connectionRequests.filter(conn => {
      if (status === 'register' && conn.status === 'aangesloten' && conn.ean) {
        return true;
      }
      return false;
    });
  };

  // Count connections by status
  const countsMap = statusColumns.reduce((acc, column) => {
    acc[column.id] = getConnectionsByStatus(column.id).length;
    return acc;
  }, {} as Record<string, number>);

  // For demo purposes, add sample data to the register column
  countsMap.register = 2;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Energiecontract aanvragen</CardTitle>
        <CardDescription>
          Beheer energiecontracten voor aansluitingen in dit object.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {statusColumns.map((column) => (
            <div key={column.id} className={`${column.color} rounded-md border p-3 h-full min-h-[200px]`}>
              <div className="font-medium mb-3 flex justify-between items-center">
                <div className="flex items-center">
                  {column.icon}
                  {column.label}
                </div>
                <Badge variant="outline">{countsMap[column.id] || 0}</Badge>
              </div>
              <div className="space-y-2">
                {column.id === 'register' ? (
                  <>
                    <div className="p-3 rounded-md bg-white border shadow-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          <Zap className="h-3 w-3 mr-1" /> Elektra
                        </Badge>
                        <span className="text-xs text-muted-foreground">3x25A</span>
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {objectName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        EAN: 871687167261534600
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">
                        Contract aanvragen
                      </Button>
                    </div>
                    <div className="p-3 rounded-md bg-white border shadow-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <Flame className="h-3 w-3 mr-1" /> Gas
                        </Badge>
                        <span className="text-xs text-muted-foreground">G4</span>
                      </div>
                      <div className="text-sm font-medium mt-1">
                        {objectName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        EAN: 871687167261598700
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-2 text-xs h-7">
                        Contract aanvragen
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
                    Geen contracten
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
