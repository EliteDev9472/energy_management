
import { useState, useEffect } from 'react';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CircleAlert, Flame, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EnergyConnection } from '@/types/connection/energy-connection';
import { toast } from '@/hooks/use-toast';

interface ConnectionsListProps {
  objectId: string;
}

export function ConnectionsList({ objectId }: ConnectionsListProps) {
  const [connections, setConnections] = useState<EnergyConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchConnections() {
      setLoading(true);
      try {
        const data = await energyConnectionService.getEnergyConnectionsByObjectId(objectId);
        setConnections(data);
      } catch (error) {
        console.error('Error fetching connections:', error);
        toast({
          title: "Fout bij ophalen aansluitingen",
          description: "Er is een fout opgetreden bij het ophalen van de aansluitingen.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchConnections();
  }, [objectId]);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'nieuw':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Nieuw</Badge>;
      case 'in_progress':
      case 'in behandeling':
        return <Badge className="bg-blue-500">In behandeling</Badge>;
      case 'offer_accepted':
      case 'offerte geaccepteerd':
        return <Badge className="bg-purple-500">Offerte geaccepteerd</Badge>;
      case 'planned':
      case 'gepland':
        return <Badge className="bg-amber-500">Gepland</Badge>;
      case 'active':
      case 'actief':
        return <Badge className="bg-green-500">Actief</Badge>;
      case 'cancelled':
      case 'geannuleerd':
        return <Badge variant="outline" className="border-red-500 text-red-700">Geannuleerd</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    if (type.toLowerCase() === 'elektriciteit') {
      return <Zap className="h-4 w-4 mr-1 text-amber-500" />;
    } else if (type.toLowerCase() === 'gas') {
      return <Flame className="h-4 w-4 mr-1 text-blue-500" />;
    } else {
      return <CircleAlert className="h-4 w-4 mr-1 text-blue-500" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cedrus-accent mx-auto"></div>
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="p-6 text-center bg-muted/20">
        <Zap className="mx-auto h-6 w-6 text-muted-foreground/50 mb-2" />
        <p className="text-sm text-muted-foreground mb-3">
          Nog geen aansluitingen voor dit object
        </p>
        <Button 
          size="sm"
          variant="outline"
          onClick={() => navigate(`/connections/new?objectId=${objectId}`)}
        >
          Aansluiting Toevoegen
        </Button>
      </div>
    );
  }

  return (
    <div className="pl-16 pr-4 pb-4">
      <div className="bg-muted/20 rounded-md">
        <div className="p-3 border-b">
          <h4 className="text-sm font-medium flex items-center">
            <Zap className="h-4 w-4 mr-2 text-amber-500" />
            Aansluitingen
          </h4>
        </div>
        <div className="divide-y">
          {connections.map(connection => (
            <div key={connection.id} className="p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-sm flex items-center">
                  {getTypeIcon(connection.type)}
                  {connection.type}
                </div>
                <div className="text-xs text-muted-foreground">
                  {connection.capacity || '-'} • {connection.ean || 'Geen EAN'}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge(connection.status)}
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => navigate(`/connections/${connection.id}`)}
                >
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
