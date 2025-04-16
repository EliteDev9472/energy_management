
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Zap, TableProperties } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { EnergyConnection } from '@/types/connection/energy-connection';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { toast } from '@/hooks/use-toast';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from '@/components/ui/table';

interface ComplexConnectionsTabProps {
  complexId: string;
  complexName: string;
}

export function ComplexConnectionsTab({ complexId, complexName }: ComplexConnectionsTabProps) {
  const [connections, setConnections] = useState<EnergyConnection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const loadConnections = async () => {
      setIsLoading(true);
      try {
        const connectionsData = await energyConnectionService.getEnergyConnectionsByComplexId(complexId);
        setConnections(connectionsData);
      } catch (error) {
        console.error('Error loading connections:', error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de aansluitingen.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadConnections();
  }, [complexId]);
  
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
  
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case 'elektriciteit':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Elektriciteit</Badge>;
      case 'gas':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Gas</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-blue mt-8 mb-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Aansluitingen in {complexName}</h2>
        <Button 
          onClick={() => navigate(`/connections/new?complexId=${complexId}`)}
          className="bg-cedrus-accent hover:bg-cedrus-accent/90 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nieuwe Aansluiting
        </Button>
      </div>
      
      {connections.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Zap className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Geen aansluitingen gevonden</h3>
              <p className="text-muted-foreground mb-4">
                Er zijn nog geen aansluitingen direct gekoppeld aan dit complex.
              </p>
              <Button 
                onClick={() => navigate(`/connections/new?complexId=${complexId}`)}
                className="bg-cedrus-accent hover:bg-cedrus-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Aansluiting Toevoegen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TableProperties className="h-5 w-5 text-cedrus-accent" />
              Alle Aansluitingen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Adres</TableHead>
                  <TableHead>Capaciteit</TableHead>
                  <TableHead>EAN</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {connections.map((connection) => (
                  <TableRow key={connection.id}>
                    <TableCell>{getTypeBadge(connection.type)}</TableCell>
                    <TableCell>{connection.address}, {connection.city}</TableCell>
                    <TableCell>{connection.capacity || '-'}</TableCell>
                    <TableCell>{connection.ean || 'Geen EAN'}</TableCell>
                    <TableCell>{getStatusBadge(connection.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/connections/${connection.id}`)}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
