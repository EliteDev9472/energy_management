
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, Plus, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useObjects } from '@/hooks/use-objects';
import { Project } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { useEffect, useState } from 'react';

export default function ObjectsPage() {
  const navigate = useNavigate();
  const { objects, loading, error } = useObjects();
  const [projects, setProjects] = useState<Record<string, Project>>({});

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch all projects to have them available for reference
        const fetchedProjects = await hierarchyService.getProjects();
        const projectsMap: Record<string, Project> = {};
        fetchedProjects.forEach(project => {
          projectsMap[project.id] = project;
        });
        setProjects(projectsMap);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
    }

    fetchProjects();
  }, []);

  const handleAddConnection = (objectId: string, objectName: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent navigation to object details

    // Navigate to new connection page with object pre-selected
    navigate(`/connections/new?objectId=${objectId}&objectName=${encodeURIComponent(objectName)}`);
  };

  const getProjectName = (projectId: string) => {
    return projects[projectId]?.name || 'Onbekend project';
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Objecten</h1>
            <p className="text-muted-foreground mt-1">
              Beheer uw gebouwen en objecten
            </p>
          </div>
          <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={() => navigate('/objects/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nieuw Object
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
          </div>
        ) : error ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium mb-2 text-red-500">Er is een fout opgetreden</h3>
            <p className="text-muted-foreground mb-4">
              Er is een probleem bij het laden van objecten. Probeer het later opnieuw.
            </p>
            <Button onClick={() => window.location.reload()}>
              Opnieuw proberen
            </Button>
          </div>
        ) : objects.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <h3 className="text-lg font-medium mb-2">Geen objecten gevonden</h3>
            <p className="text-muted-foreground mb-4">
              Er zijn nog geen objecten aangemaakt.
            </p>
            <Button onClick={() => navigate('/objects/new')}>
              <Plus className="mr-2 h-4 w-4" /> Object toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {objects.map((object) => (
              <Card key={object.id} className="hover:shadow-md cursor-pointer" onClick={() => navigate(`/objects/${object.id}`)}>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Home className="h-5 w-5 text-cedrus-accent" />
                    {object.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {object.address}
                    {object.city && `, ${object.city}`}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {getProjectName(object.projectId || '')}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700">
                        <Database className="h-3 w-3" />
                        <span>{object.connectionCount || 0} meters</span>
                      </Badge>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs"
                        onClick={(e) => handleAddConnection(object.id, object.name, e)}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Aansluiting
                      </Button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <Button
                      variant="link"
                      size="sm"
                      className="text-xs p-0 h-auto"
                      onClick={() => navigate(`/objects/${object.id}`)}
                    >
                      Details bekijken
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
