
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Database, Droplet, Edit, Flame, Plus, Trash2, Zap } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { hierarchyService, objectService } from '@/services/hierarchy';
import { useObjectById } from '@/hooks/use-objects';
import { HierarchyObject as Object, Complex, Project, HierarchyObject } from '@/types/hierarchy';
import { ConnectionPipelineTab } from '@/components/objects/ConnectionPipelineTab';
import { ConnectionRequestTab } from '@/components/objects/ConnectionRequestTab';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TypeBadge } from '@/components/connections/table/TypeBadge';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Connection, ConnectionStatus, ConnectionType } from '@/types/connection';

export default function ObjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [object, setObject] = useState<HierarchyObject | null>(null);
  const [complex, setComplex] = useState<Complex | null>(null);
  const [project, setProject] = useState<Project | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("meters");

  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingConnections, setIsLoadingConnections] = useState(true);

  useEffect(() => {
    const fetchObjectDetails = async () => {
      if (!id) return;
      setIsLoading(true)
      try {
        const data = await objectService.getObjectById(id);
        setObject(data);
      } catch (err) {
        console.error(`Error fetching object ${id}:`, err);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van het object.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchObjectDetails();
  }, [id]);

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

  useEffect(() => {

    const fetchObjectConnections = async () => {
      if (!id) return;

      setIsLoadingConnections(true);
      try {
        const { data, error } = await supabase
          .from('connections')
          .select('*')
          .eq('object_id', id);

        if (error) {
          throw error;
        }
        const transformedConnections: Connection[] = data.map(conn => ({
          id: conn.id,
          ean: conn.ean || '',
          address: conn.address,
          city: conn.city || '',
          postalCode: conn.postal_code || '',
          type: conn.type as ConnectionType,
          status: conn.status as ConnectionStatus,
          supplier: conn.supplier || '',
          object: object?.name || '',
          entity: conn.entity || '',
          organization: conn.organization || '',
          project: '',
          gridOperator: conn.grid_operator || '',
          lastModified: conn.last_modified || new Date().toISOString(),
          meteringCompany: conn.metering_company || '',
          hasFeedback: false,
          capacity: conn.capacity || '',
          plannedConnectionDate: conn.planned_connection_date || '',
          // Add an empty contract object to match the Connection type
          contract: {
            endDate: '',
            price: '',
            type: '',
            startDate: '',
            conditions: ''
          }
        }));

        setConnections(transformedConnections);

        if (object) {
          setObject({
            ...object,
            connectionCount: transformedConnections.length,
            connectionStatus: transformedConnections.length > 0 ? 'Actief' : 'Inactief',
            meters: transformedConnections.map(conn => ({
              id: conn.id,
              name: conn.address,
              type: conn.type,
              ean: conn.ean || '',
              status: conn.status
            }))
          })
        }
      } catch (error) {
        console.error('Error fetching object connections:', error);
        toast({
          title: "Fout bij laden",
          description: "Kon aansluitingen niet laden. Probeer het later opnieuw.",
          variant: "destructive",
        });
        setConnections([]);
      } finally {
        setIsLoadingConnections(false);
      }
    };

    if (!isLoading && object) {
      fetchObjectConnections();
    }
  }, [id, isLoading]);

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

  const getMeterIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'electricity':
      case 'elektriciteit':
        return <Zap className="h-4 w-4" />;
      case 'gas':
        return <Flame className="h-4 w-4" />;
      case 'water':
        return <Droplet className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const getMeterStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-700">Actief</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="bg-gray-100 text-gray-700">Inactief</Badge>;
      case 'pending':
        return <Badge variant="outline" className="bg-blue-100 text-blue-700">In Aanvraag</Badge>;
      case 'ingekocht':
        return <Badge variant="outline" className="bg-purple-100 text-purple-700">Ingekocht</Badge>;
      case 'nog_in_te_kopen':
        return <Badge variant="outline" className="bg-amber-100 text-amber-700">Nog in te kopen</Badge>;
      case 'afgemeld':
        return <Badge variant="outline" className="bg-red-100 text-red-700">Afgemeld</Badge>;
      case 'opgeleverd':
        return <Badge variant="outline" className="bg-teal-100 text-teal-700">Opgeleverd</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
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

        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
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
        </div> */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Project</CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="p-0 h-auto text-base font-medium hover:bg-transparent hover:underline"
                onClick={() => navigate(`/projects/${object.projectId}`)}
              >
                Project bekijken
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Type & Fase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Badge className="mr-2 capitalize">
                  {object.objectType || 'Woning'}
                </Badge>
                {object.buildPhase && (
                  <Badge variant="outline" className="capitalize">
                    {object.buildPhase}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Aansluitingen</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{object.connectionCount || connections.length || 0}</p>
              <p className="text-sm text-muted-foreground">Totaal aansluitingen</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="meters" value={activeTab} onValueChange={handleTabChange}>
          <TabsList className="mb-4">
            <TabsTrigger value="meters">Aansluitingen</TabsTrigger>
            <TabsTrigger value="connections">Aansluitingen aanvragen</TabsTrigger>
            <TabsTrigger value="contracts">Energiecontract aanvragen</TabsTrigger>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="documents">Documenten</TabsTrigger>
          </TabsList>

          <TabsContent value="meters" className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Aansluitingen</h2>
              <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={() => navigate(`/connections/new?objectId=${object.id}`)}>
                <Plus className="mr-2 h-4 w-4" /> Nieuwe Aansluiting
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-cedrus-accent" />
                  Meters & Aansluitingen
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingConnections ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
                  </div>
                ) : connections && connections.length > 0 ? (
                  <div className="divide-y">
                    {connections.map((connection) => (
                      <div key={connection.id} className="py-3 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${connection.type.toLowerCase() === 'elektriciteit' || connection.type.toLowerCase() === 'electricity' ? 'bg-blue-100 text-blue-700' :
                            connection.type.toLowerCase() === 'gas' ? 'bg-orange-100 text-orange-700' :
                              'bg-cyan-100 text-cyan-700'
                            }`}>
                            {getMeterIcon(connection.type)}
                          </div>
                          <div>
                            <h3 className="font-medium">{connection.address}</h3>
                            <p className="text-xs text-muted-foreground font-mono">{connection.ean || 'Geen EAN'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TypeBadge type={connection.type.toLowerCase()} />
                          {getMeterStatusBadge(connection.status.toLowerCase())}
                          <Button variant="outline" size="sm" onClick={() => navigate(`/connections/${connection.id}`)}>
                            Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">Geen aansluitingen gevonden voor dit object.</p>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/connections/new?objectId=${object.id}`)}
                      className="mt-2"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Aansluiting toevoegen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="connections">
            <ConnectionRequestTab
              objectId={id || ''}
              projectId={project?.id || ''}
              objectName={object.name}
            // connections={connections}
            // setConnections={setConnections}
            />
          </TabsContent>
          <TabsContent value="contracts">
            <ConnectionPipelineTab
              objectId={id || ''}
              objectName={object?.name || ''}
              projectId={project?.id}
            />
          </TabsContent>
          <TabsContent value="details" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Object Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Naam</h3>
                    <p>{object.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Type</h3>
                    <p className="capitalize">{object.objectType || 'Woning'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Adres</h3>
                    <p>{object.address || 'Niet ingevuld'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Stad</h3>
                    <p>{object.city || 'Niet ingevuld'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Postcode</h3>
                    <p>{object.postalCode || 'Niet ingevuld'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">Bouwfase</h3>
                    <p className="capitalize">{object.buildPhase || 'Niet gespecificeerd'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Documenten</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Geen documenten beschikbaar.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
