
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Database, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Connection } from '@/types/connection';
import { useEffect, useState } from 'react';
import { TypeBadge } from '@/components/connections/table/TypeBadge';
import { StatusBadge } from '@/components/connections/table/StatusBadge';
import { useNavigate } from 'react-router-dom';
import { getRecentConnections } from '@/services/dashboardService';

export function ConnectionsOverview() {
  const navigate = useNavigate();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        const recentConnections = await getRecentConnections(4);
        setConnections(recentConnections as Connection[]);
      } catch (error) {
        console.error('Error fetching connections:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchConnections();
  }, []);
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium flex items-center gap-2">
          <Database className="h-4 w-4" />
          Aansluitingen Overzicht
        </CardTitle>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-8 gap-1 text-xs"
          onClick={() => navigate('/connections')}
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Alle aansluitingen
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <p className="text-muted-foreground">Geen aansluitingen gevonden</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground p-3 border-b">
              <div className="col-span-4">Aansluiting</div>
              <div className="col-span-3">Object</div>
              <div className="col-span-2">Type</div>
              <div className="col-span-3 text-right">Status</div>
            </div>
            <div className="divide-y">
              {connections.map((connection) => (
                <div 
                  key={connection.id} 
                  className="grid grid-cols-12 p-3 text-sm items-center cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/connections/${connection.id}`)}
                >
                  <div className="col-span-4">
                    <div className="font-medium">{connection.ean || 'Geen EAN'}</div>
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      {connection.capacity ? (
                        <span>{connection.capacity}</span>
                      ) : (
                        <span><Building className="h-3 w-3 mr-1" /> {connection.city || 'Onbekend'}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="col-span-3 text-xs">
                    {connection.object || 'Onbekend object'}
                  </div>
                  
                  <div className="col-span-2">
                    <TypeBadge type={connection.type} />
                  </div>
                  
                  <div className="col-span-3 text-right">
                    <StatusBadge status={connection.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
