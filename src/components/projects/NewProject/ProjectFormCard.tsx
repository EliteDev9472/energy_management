
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ProjectBasicInfoFields } from './ProjectBasicInfoFields';
import { TeamMember } from '@/types/project';
import { ProjectStatus, BuildingPhase } from '@/types/project';

interface ProjectFormCardProps {
  formData: {
    projectNumber: string;
    name: string;
    customer: string;
    status: ProjectStatus;
    projectManager: string;
    startDate: string;
    endDate: string;
    address: string;
    city: string;
    buildingPhase: BuildingPhase;
  };
  teamMembers: TeamMember[];
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSelectChange: (name: string, value: string) => void;
}

export const ProjectFormCard = ({
  formData,
  teamMembers,
  handleChange,
  handleSelectChange
}: ProjectFormCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Projectgegevens</CardTitle>
        <CardDescription>Vul de basisgegevens van het project in</CardDescription>
      </CardHeader>
      <CardContent>
        <ProjectBasicInfoFields 
          formData={formData}
          teamMembers={teamMembers}
          handleChange={handleChange}
          handleSelectChange={handleSelectChange}
        />
      </CardContent>
    </Card>
  );
};
