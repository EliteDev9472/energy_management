
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Zap, RefreshCw, ChevronRight, Bolt, Flame } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { hierarchicalConnectionService } from '@/services/connections/hierarchicalConnectionService';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { toast } from '@/hooks/use-toast';

interface ConnectionRequestTabProps {
  objectId: string;
  projectId: string;
  connections: any[];
  setConnections: (connections: any[]) => void;
}

export function ConnectionRequestTab({ objectId, projectId, connections, setConnections }: ConnectionRequestTabProps) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchConnectionRequests = async () => {
    if (!objectId) return;

    setLoading(true);
    try {
      const requests = await hierarchicalConnectionService.getConnectionRequestsByObjectId(objectId);
      setConnections(requests);
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      toast({
        title: 'Fout bij laden aansluitingsaanvragen',
        description: 'Er is een fout opgetreden bij het laden van de aansluitingsaanvragen.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConnectionRequests();
  }, [objectId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Nieuw</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">In Behandeling</Badge>;
      case 'OFFER_REQUESTED':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Offerte Aangevraagd</Badge>;
      case 'OFFER_RECEIVED':
        return <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200">Offerte Ontvangen</Badge>;
      case 'OFFER_ACCEPTED':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Offerte Geaccepteerd</Badge>;
      case 'PLANNED':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Ingepland</Badge>;
      case 'CONNECTED':
        return <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">Aangesloten</Badge>;
      case 'CANCELED':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Geannuleerd</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Elektriciteit':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Bolt className="h-3 w-3 mr-1" /> Elektriciteit
          </Badge>
        );
      case 'Gas':
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Flame className="h-3 w-3 mr-1" /> Gas
          </Badge>
        );
      case 'Water':
        return <Badge variant="outline" className="bg-cyan-50 text-cyan-700 border-cyan-200">Water</Badge>;
      case 'Warmte':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">Warmte</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const handleCreateConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}`);
  };

  const handleElectricityConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}&type=Elektriciteit`);
  };

  const handleGasConnectionRequest = () => {
    navigate(`/connections/new?objectId=${objectId}&projectId=${projectId}&type=Gas`);
  };

  const handleViewRequest = (requestId: string) => {
    navigate(`/connections/${requestId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Aansluitingen aanvragen</h3>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchConnectionRequests} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
          <Button onClick={handleCreateConnectionRequest}>
            <Plus className="h-4 w-4 mr-2" />
            Nieuwe Aanvraag
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Button 
          onClick={handleElectricityConnectionRequest}
          variant="outline"
          className="flex-1"
        >
          <Bolt className="h-4 w-4 mr-2 text-yellow-600" />
          Elektriciteitsaansluiting aanvragen
        </Button>
        
        <Button 
          onClick={handleGasConnectionRequest}
          variant="outline"
          className="flex-1"
        >
          <Flame className="h-4 w-4 mr-2 text-blue-600" />
          Gasaansluiting aanvragen
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        <div className="bg-blue-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Nieuwe aanvraag
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            In behandeling
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Offerte geaccepteerd
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-indigo-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Gepland
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-amber-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Uitvoering
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Aangesloten
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
        
        <div className="bg-cyan-50 rounded-md border p-3 h-full min-h-[200px]">
          <div className="font-medium mb-3 flex justify-between">
            Contract aanvragen
            <Badge variant="outline">0</Badge>
          </div>
          <div className="space-y-2">
            <div className="p-3 rounded-md bg-white border border-dashed text-center text-sm text-muted-foreground">
              Geen aanvragen
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : connections.length === 0 ? (
        <Card>
          <CardContent className="p-8 flex flex-col items-center text-center">
            <Zap className="h-12 w-12 text-muted-foreground mb-4" />
            <CardTitle className="mb-2">Geen aansluitingsaanvragen</CardTitle>
            <CardDescription className="mb-6">
              Er zijn nog geen aansluitingsaanvragen voor dit object. Maak een nieuwe aanvraag om te beginnen.
            </CardDescription>
            <Button onClick={handleCreateConnectionRequest}>
              <Plus className="h-4 w-4 mr-2" />
              Nieuwe Aanvraag
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Recente aanvragen</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {connections.map((request) => (
              <Card 
                key={request.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewRequest(request.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium">{request.address}</h4>
                      <p className="text-sm text-muted-foreground">{request.city}</p>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                      {getStatusBadge(request.status)}
                      {getTypeBadge(request.type)}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Netbeheerder:</span>
                      <span>{request.grid_operator}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Aangevraagd:</span>
                      <span>{formatDate(request.request_date)}</span>
                    </div>
                    {request.ean && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">EAN:</span>
                        <span>{request.ean}</span>
                      </div>
                    )}
                    {request.desired_connection_date && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gewenste datum:</span>
                        <span>{formatDate(request.desired_connection_date)}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="h-8">
                      Details <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
