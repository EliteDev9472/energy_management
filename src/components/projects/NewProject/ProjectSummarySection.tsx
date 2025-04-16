
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TeamMember } from '@/types/project';
import { Category } from '@/types/hierarchy';

interface ProjectSummarySectionProps {
  formData: {
    projectNumber: string;
    name: string;
    status: string;
    customer: string;
    projectManager: string;
    category: string;
    startDate: string;
    endDate: string;
    address?: string; // Added address as optional
    city?: string; // Added city as optional
    buildingPhase?: string; // Added buildingPhase as optional
  };
  categories: Category[];
  teamMembers: TeamMember[];
}

export const ProjectSummarySection = ({ formData, categories, teamMembers }: ProjectSummarySectionProps) => {
  // Get the selected category name if available
  const categoryName = formData.category 
    ? categories.find(cat => cat.id === formData.category)?.name || '-' 
    : '-';
  
  // Get the selected project manager name if available
  const projectManagerName = formData.projectManager 
    ? teamMembers.find(member => member.id === formData.projectManager)?.name || '-' 
    : '-';

  // Format building phase for display
  const formatBuildingPhase = (phase: string | undefined) => {
    if (!phase) return '-';
    
    // Convert from snake_case or lowercase to Title Case
    const formatted = phase
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
    
    return formatted;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Samenvatting</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center mb-4">
          <div className="text-center">
            <div className="bg-gray-100 p-4 rounded-md mb-2 inline-block">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            </div>
            <div className="text-sm text-gray-500">
              {formData.projectNumber}
            </div>
            <div className="font-semibold">
              {formData.name || 'Nieuw Project'}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Projectnummer</div>
            <div className="text-right font-medium">{formData.projectNumber || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Categorie</div>
            <div className="text-right font-medium">{categoryName}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Klant</div>
            <div className="text-right font-medium">{formData.customer || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Status</div>
            <div className="text-right font-medium">
              {formData.status === 'concept' ? 'Concept' : 
                formData.status === 'in_aanvraag' ? 'In aanvraag' : 
                formData.status === 'lopend' ? 'Lopend' : 
                formData.status === 'afgerond' ? 'Afgerond' : '-'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Projectmanager</div>
            <div className="text-right font-medium">{projectManagerName}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Startdatum</div>
            <div className="text-right font-medium">{formData.startDate || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Einddatum</div>
            <div className="text-right font-medium">{formData.endDate || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Adres</div>
            <div className="text-right font-medium">{formData.address || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Stad</div>
            <div className="text-right font-medium">{formData.city || '-'}</div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-500">Bouwfase</div>
            <div className="text-right font-medium">{formatBuildingPhase(formData.buildingPhase)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
