
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ProjectBreadcrumb } from './ProjectBreadcrumb';

interface ProjectHeaderSectionProps {
  selectedOrganization: string;
  selectedOrganizationName: string;
  selectedEntity: string;
  selectedEntityName: string;
  selectedCategory: string;
  selectedCategoryName: string;
  onOrganizationChange: (id: string, name: string) => void;
  onEntityChange: (id: string, name: string) => void;
  onCategoryChange: (id: string, name: string) => void;
}

export const ProjectHeaderSection = ({
  selectedOrganization,
  selectedOrganizationName,
  selectedEntity,
  selectedEntityName,
  selectedCategory,
  selectedCategoryName,
  onOrganizationChange,
  onEntityChange,
  onCategoryChange
}: ProjectHeaderSectionProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Terug naar projectoverzicht
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuw Project</h1>
          <p className="text-muted-foreground mt-1">
            Maak een nieuw project aan in Cedrus Energy Manager
          </p>
        </div>
      </div>
      
      <ProjectBreadcrumb
        selectedOrganization={selectedOrganization}
        selectedOrganizationName={selectedOrganizationName}
        selectedEntity={selectedEntity}
        selectedEntityName={selectedEntityName}
        selectedCategory={selectedCategory}
        selectedCategoryName={selectedCategoryName}
        onOrganizationChange={onOrganizationChange}
        onEntityChange={onEntityChange}
        onCategoryChange={onCategoryChange}
      />
    </div>
  );
};
