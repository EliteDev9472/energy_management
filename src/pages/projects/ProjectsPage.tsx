
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectDataTable } from '@/components/projects/ProjectDataTable';
import { ProjectFilters } from '@/components/projects/ProjectFilters';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/PageHeader';
import { hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { Project } from '@/types/hierarchy';
import { mapDbToProject } from '@/services/hierarchy/helpers';
import { PageLayout } from '@/components/layout/PageLayout';
import { supabase } from '@/integrations/supabase/client';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        console.log("Fetching projects...");

        // Directly fetch from Supabase for debugging
        const { data: projectData, error } = await supabase
          .from('projects')
          .select('*');

        if (error) {
          console.error('Supabase error:', error);
          throw error;
        }

        console.log("Fetched projects:", projectData);

        if (projectData && projectData.length > 0) {
          // Map database projects to Project type
          const typedProjects = projectData.map(project => ({
            id: project.id,
            name: project.name,
            projectNumber: project.project_number || '',
            description: project.description || '',
            status: project.status as any,
            startDate: project.start_date || '',
            endDate: project.end_date || '',
            categoryId: project.category_id || '',
            categoryName: '',
            objects: [],
            customer: project.customer || '',
            projectManager: project.project_manager || '',
            city: project.city || '',
            address: project.address || '',
            buildingPhase: project.building_phase || 'planning',
            notes: project.notes || '',
            connectionCount: project.connection_count || 0,
            createdAt: project.created_at,
            updatedAt: project.updated_at
          }));

          setProjects(typedProjects);
        } else {
          console.log("No projects found");
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Fout bij ophalen projecten',
          description: 'Er is een fout opgetreden bij het ophalen van de projecten.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleCreateProject = () => {
    navigate(`/projects/new`);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-6">
        <PageHeader
          title="Projecten"
          description="Beheer al je energie-projecten op één plek."
        >
          <Button onClick={handleCreateProject}>
            <Plus className="mr-2 h-4 w-4" /> Nieuw project
          </Button>
        </PageHeader>

        <div className="mt-6 space-y-6">
          <ProjectFilters />

          {loading ? (
            <Loading />
          ) : (
            <ProjectDataTable projects={projects} />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
