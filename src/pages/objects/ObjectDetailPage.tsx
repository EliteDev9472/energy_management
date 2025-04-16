
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchy';
import { useObjectById } from '@/hooks/use-objects';
import { HierarchyObject, Complex, Project } from '@/types/hierarchy';
import { ConnectionPipelineTab } from '@/components/objects/ConnectionPipelineTab';
import { ConnectionRequestTab } from '@/components/objects/ConnectionRequestTab';

export default function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { object, loading, error } = useObjectById(id);
  const [complex, setComplex] = useState<Complex | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("connections");

  useEffect(() => {
    if (object?.complexId) {
      hierarchyService.getComplexById(object.complexId)
        .then(data => {
          setComplex(data);

          if (data?.projectId) {
            hierarchyService.getProjectById(data.projectId)
              .then(projData => {
                setProject(projData);
              })
              .catch(err => {
                console.error('Error fetching project:', err);
              });
          }
        })
        .catch(err => {
          console.error('Error fetching complex:', err);
        });
    }
  }, [object]);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);
    try {
      await hierarchyService.deleteObject(id);
      toast({
        title: "Object verwijderd",
        description: "Het object is succesvol verwijderd.",
      });
      navigate('/objects');
    } catch (error) {
      console.error('Error deleting object:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van het object.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
        </div>
      </PageLayout>
    );
  }

  if (error || !object) {
    return (
      <PageLayout>
        <div className="text-center p-8 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-medium mb-2 text-red-500">Object niet gevonden</h3>
          <p className="text-muted-foreground mb-4">
            Het object kon niet worden gevonden of er is een fout opgetreden.
          </p>
          <Button onClick={() => navigate('/objects')}>
            Terug naar objecten
          </Button>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/objects')} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Terug
          </Button>
          <h1 className="text-2xl font-bold text-cedrus-blue flex-grow">{object.name}</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/objects/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Bewerken
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Verwijderen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Weet je zeker dat je dit object wilt verwijderen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Deze actie kan niet ongedaan worden gemaakt. Alle gerelateerde data, zoals aansluitingen,
                    zullen ook worden verwijderd.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isDeleting ? 'Bezig met verwijderen...' : 'Verwijderen'}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Adres</h3>
              <p>{object.address || 'Niet gespecificeerd'}</p>
              <p>{object.postalCode} {object.city}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Type & Fase</h3>
              <p>Type: {object.objectType || 'Niet gespecificeerd'}</p>
              <p>Bouwfase: {object.buildPhase || 'Niet gespecificeerd'}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Hiërarchie</h3>
              <p>Project: {project?.name || 'Onbekend'}</p>
              <p>Complex: {complex?.name || 'Onbekend'}</p>
            </div>
          </div>
          {object.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-muted-foreground mb-1">Omschrijving</h3>
              <p>{object.description}</p>
            </div>
          )}
        </div>

        <Tabs defaultValue="connections" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="connections">Aansluitingen</TabsTrigger>
            <TabsTrigger value="contracts">Energiecontract aanvragen</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
          </TabsList>
          <TabsContent value="connections">
            <ConnectionRequestTab
              objectId={id || ''}
              projectId={project?.id || ''}
              connections={connections}
              setConnections={setConnections}
            />
          </TabsContent>
          <TabsContent value="contracts">
            <ConnectionPipelineTab
              objectId={id || ''}
              objectName={object?.name || ''}
              projectId={project?.id}
            />
          </TabsContent>
          <TabsContent value="details">
            <div className="p-4 border rounded-md">
              <h3 className="text-lg font-medium mb-2">Object details</h3>
              <p className="text-muted-foreground">
                Gedetailleerde informatie over het object.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
