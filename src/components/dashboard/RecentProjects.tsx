
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Project } from '@/types/hierarchy';

export function RecentProjects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, name, status, city')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        const formattedProjects = data.map((p) => ({
          id: p.id,
          name: p.name,
          status: p.status,
          city: p.city || ''
        })) as Project[];

        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching recent projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium">Recente Projecten</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cedrus-accent"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground text-sm">
              Geen projecten gevonden
            </p>
            <Button 
              onClick={() => navigate('/projects/new')} 
              variant="outline" 
              size="sm" 
              className="mt-2"
            >
              Project aanmaken
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div 
                key={project.id}
                className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-muted/50 transition-colors"
                onClick={() => navigate(`/projects/${project.id}`)}
              >
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-sm font-medium">{project.name}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{project.city}</span>
                    <Badge variant="outline" className="text-xs">
                      {project.status === 'lopend' ? 'Lopend' : 
                       project.status === 'in_aanvraag' ? 'In Aanvraag' : 
                       project.status === 'afgerond' ? 'Afgerond' : 
                       project.status === 'concept' ? 'Concept' : project.status}
                    </Badge>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-center text-muted-foreground hover:text-primary"
              onClick={() => navigate('/projects')}
            >
              Alle projecten bekijken
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
