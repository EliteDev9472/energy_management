
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent } from "@/components/ui/card";
import { useParams, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, useEffect } from 'react';
import { Connection } from '@/types/connection';
import { ConnectionTechnicalTab } from '@/components/connections/detail/ConnectionTechnicalTab';
import { ConnectionInvoicesTab } from '@/components/connections/detail/ConnectionInvoicesTab';
import { ConnectionConsumptionTab } from '@/components/connections/detail/ConnectionConsumptionTab';
import { ConnectionHistoryTab } from '@/components/connections/detail/ConnectionHistoryTab';
import { ConnectionDetailHeader } from '@/components/connections/detail/ConnectionDetailHeader';
import { ConnectionKeyInfo } from '@/components/connections/detail/ConnectionKeyInfo';
import { ConnectionDetailsTab } from '@/components/connections/detail/ConnectionDetailsTab';
import { ConnectionDetailActions } from '@/components/connections/detail/ConnectionDetailActions';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { connectionService } from '@/services/connections/connectionService';
import { toast } from '@/hooks/use-toast';
import { ConnectionHierarchyInfo } from '@/components/connections/detail/ConnectionHierarchyInfo';
import { energyConnectionService } from '@/services/connections/energyConnectionService';
import { EnergyConnection } from '@/types/connection/energy-connection';

export default function ConnectionDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');
  const [connection, setConnection] = useState<Connection | null>(null);
  const [energyConnection, setEnergyConnection] = useState<EnergyConnection | null>(null);
  const [loading, setLoading] = useState(true);
  
  // First try to fetch connection from the energy_connections table
  useEffect(() => {
    async function loadConnection() {
      if (!id) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        console.log('Attempting to load connection with ID:', id);
        
        // First try to get from energy_connections table
        try {
          const energyConnectionData = await energyConnectionService.getEnergyConnectionById(id);
          console.log('Found energy connection:', energyConnectionData);
          setEnergyConnection(energyConnectionData);
          
          // Convert EnergyConnection to Connection type for compatibility with UI components
          const convertedConnection: Connection = {
            id: energyConnectionData.id,
            address: energyConnectionData.address,
            city: energyConnectionData.city || '',
            postalCode: energyConnectionData.postalCode || '',
            type: energyConnectionData.type,
            status: energyConnectionData.status,
            supplier: '',
            object: energyConnectionData.objectName || '',
            entity: '',
            organization: '',
            project: '',
            gridOperator: energyConnectionData.gridOperator || '',
            lastModified: '',
            meteringCompany: '',
            hasFeedback: false,
            capacity: energyConnectionData.capacity || '',
            gridOperatorWorkNumber: energyConnectionData.gridOperatorWorkNumber || '',
            connectionAddress: energyConnectionData.address,
            gridOperatorContact: '',
            plannedConnectionDate: energyConnectionData.plannedConnectionDate || '',
            meteringType: energyConnectionData.meteringType || '',
            ean: energyConnectionData.ean || '',
          };
          
          setConnection(convertedConnection);
          setLoading(false);
          return;
        } catch (error) {
          console.log('Failed to load from energy_connections, trying connections table...');
        }
        
        // If not found, try to get from connections table
        const connectionData = await connectionService.getConnectionById(id);
        console.log('Found connection:', connectionData);
        setConnection(connectionData);
      } catch (error) {
        console.error("Error loading connection:", error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de aansluiting.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }
    
    loadConnection();
  }, [id]);
  
  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Aansluiting Details</h1>
            <p className="text-muted-foreground mt-1">Laden...</p>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  if (!connection) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Aansluiting Details</h1>
            <p className="text-muted-foreground mt-1">Aansluiting niet gevonden</p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p>De gevraagde aansluiting kon niet worden gevonden.</p>
            <Button 
              className="mt-4" 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Terug
            </Button>
          </CardContent>
        </Card>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <ConnectionDetailHeader connection={connection} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Key information card */}
          <div className="md:col-span-2">
            <Card>
              <ConnectionKeyInfo connection={connection} />
            </Card>
          </div>
          
          {/* Hierarchy Information */}
          <div className="md:col-span-1">
            <ConnectionHierarchyInfo 
              connection={connection}
            />
          </div>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="technical">Technisch</TabsTrigger>
            <TabsTrigger value="invoices">Facturen</TabsTrigger>
            <TabsTrigger value="consumption">Verbruik</TabsTrigger>
            <TabsTrigger value="history">Historie</TabsTrigger>
          </TabsList>
          
          {/* Details Tab */}
          <TabsContent value="details">
            <ConnectionDetailsTab connection={connection} />
          </TabsContent>
          
          {/* Technical Tab */}
          <TabsContent value="technical">
            <ConnectionTechnicalTab connection={connection} />
          </TabsContent>
          
          {/* Invoices Tab */}
          <TabsContent value="invoices">
            <ConnectionInvoicesTab connectionId={connection.id} />
          </TabsContent>
          
          {/* Consumption Tab */}
          <TabsContent value="consumption">
            <ConnectionConsumptionTab connectionId={connection.id} />
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <ConnectionHistoryTab connectionId={connection.id} connection={connection} />
          </TabsContent>
        </Tabs>
        
        {/* Bottom buttons */}
        <ConnectionDetailActions connectionId={connection.id} />
      </div>
    </PageLayout>
  );
}
