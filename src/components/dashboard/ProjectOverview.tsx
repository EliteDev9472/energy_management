
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/hierarchy';

export function ProjectOverview() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, status, city, building_phase, customer')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;

        const formattedProjects = data.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          city: p.city || '',
          buildingPhase: p.building_phase,
          customer: p.customer
        })) as Project[];

        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Filter projects based on the active tab
  const filteredProjects = projects.filter((project) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return project.status === 'lopend';
    if (activeTab === 'requests') return project.status === 'in_aanvraag';
    return false;
  });

  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'lopend': 'Lopend',
      'afgerond': 'Afgerond',
      'concept': 'Concept',
      'in_aanvraag': 'In Aanvraag'
    };
    return statusMap[status] || status;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-medium">Project Overzicht</CardTitle>
          <CardDescription>
            Recente projecten en aanvragen
          </CardDescription>
        </div>
        <Button 
          onClick={() => navigate('/projects/new')}
          variant="default" 
          size="sm" 
          className="h-8"
          asChild
        >
          <Link to="/projects/new">
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            Nieuw Project
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="all">Alle</TabsTrigger>
            <TabsTrigger value="active">Actief</TabsTrigger>
            <TabsTrigger value="requests">In Aanvraag</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab}>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-8 border rounded-md">
                <p className="text-muted-foreground">Geen projecten gevonden</p>
              </div>
            ) : (
              <div className="rounded-md border">
                <div className="grid grid-cols-12 text-xs font-medium text-muted-foreground p-3 border-b">
                  <div className="col-span-4">Naam</div>
                  <div className="col-span-3">Klant</div>
                  <div className="col-span-3">Locatie</div>
                  <div className="col-span-2 text-right">Status</div>
                </div>
                <div className="divide-y">
                  {filteredProjects.map((project) => (
                    <Link 
                      key={project.id} 
                      to={`/projects/${project.id}`}
                      className="grid grid-cols-12 p-3 text-sm items-center cursor-pointer hover:bg-muted/50"
                    >
                      <div className="col-span-4 font-medium">
                        {project.name}
                      </div>
                      <div className="col-span-3 text-xs text-muted-foreground">
                        {project.customer}
                      </div>
                      <div className="col-span-3 text-xs text-muted-foreground">
                        {project.city}
                      </div>
                      <div className="col-span-2 text-right">
                        <StatusBadge status={project.status} />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// Status badge component 
function StatusBadge({ status }: { status: string }) {
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'concept':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in_aanvraag':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'lopend':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'afgerond':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'lopend': 'Lopend',
      'afgerond': 'Afgerond',
      'concept': 'Concept',
      'in_aanvraag': 'In Aanvraag'
    };
    return statusMap[status] || status;
  };

  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${getStatusStyles(status)}`}>
      {formatStatus(status)}
    </span>
  );
}
