
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ConnectionEditForm } from '@/components/connections/forms/ConnectionEditForm';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { connectionService } from '@/services/connections/connectionService';
import { toast } from '@/hooks/use-toast';
import { Connection } from '@/types/connection';
import { Loading } from '@/components/ui/loading';

export default function EditConnectionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConnection = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const connectionData = await connectionService.getConnectionById(id);

        if (!connectionData) {
          toast({
            title: "Aansluiting niet gevonden",
            description: "De opgevraagde aansluiting kon niet worden gevonden.",
            variant: "destructive",
          });
          navigate('/connections');
          return;
        }

        setConnection(connectionData);
      } catch (error) {
        console.error("Error fetching connection:", error);
        toast({
          title: "Fout bij ophalen",
          description: "Er is een fout opgetreden bij het ophalen van de aansluiting.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchConnection();
  }, [id, navigate]);

  const handleSave = async (updatedConnection: Connection) => {
    try {
      const result = await connectionService.updateConnection(updatedConnection);
      
      if (result) {
        toast({
          title: "Aansluiting bijgewerkt",
          description: "De aansluiting is succesvol bijgewerkt.",
        });
        navigate(`/connections/${id}`);
      } else {
        throw new Error("Failed to update connection");
      }
    } catch (error) {
      console.error("Error saving connection:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de aansluiting.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    navigate(`/connections/${id}`);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/connections')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Aansluiting bewerken</h1>
            <p className="text-muted-foreground">Laden...</p>
          </div>
        </div>
        <Loading />
      </PageLayout>
    );
  }

  if (!connection) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/connections')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Aansluiting bewerken</h1>
            <p className="text-muted-foreground">Aansluiting niet gevonden</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate(`/connections/${id}`)}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Aansluiting bewerken</h1>
            <p className="text-muted-foreground">Werk de gegevens van deze aansluiting bij.</p>
          </div>
        </div>

        <div className="mt-6">
          <ConnectionEditForm 
            connection={connection} 
            onSubmit={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </div>
    </PageLayout>
  );
}
