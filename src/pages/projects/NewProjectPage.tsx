
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { hierarchyService } from '@/services/hierarchy';
import { getTeamMembers } from '@/data/mockTeamMembers';
import { ProjectStatus, BuildingPhase } from '@/types/project';

// Import our components
import { ProjectHeaderSection } from '@/components/projects/NewProject/ProjectHeaderSection';
import { ProjectFormCard } from '@/components/projects/NewProject/ProjectFormCard';
import { ProjectDescriptionSection } from '@/components/projects/NewProject/ProjectDescriptionSection';
import { ProjectSummarySection } from '@/components/projects/NewProject/ProjectSummarySection';
import { ProjectHelpSection } from '@/components/projects/NewProject/ProjectHelpSection';
import { LoadingSpinner } from '@/components/projects/NewProject/LoadingSpinner';
import { Category } from '@/types/hierarchy';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('categoryId');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // State for breadcrumb hierarchy
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedOrganizationName, setSelectedOrganizationName] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('');
  const [selectedEntityName, setSelectedEntityName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  const [formData, setFormData] = useState({
    projectNumber: `PRJ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    name: '',
    description: '',
    status: 'concept' as ProjectStatus,
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: '',
    customer: '',
    projectManager: '',
    category: '',
    address: '',
    city: '',
    buildingPhase: 'planning' as BuildingPhase
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);

        const teamMembersData = getTeamMembers();
        const projectManagers = teamMembersData.filter(member =>
          member.role === 'projectmanager'
        );
        setTeamMembers(projectManagers);

        // Fetch all categories for the dropdown
        const allCategories = await hierarchyService.getCategories();
        setCategories(allCategories);

        if (categoryId) {
          try {
            const selectedCat = await hierarchyService.getCategoryById(categoryId);
            if (selectedCat) {
              setSelectedCategory(selectedCat.id);
              setSelectedCategoryName(selectedCat.name);

              // Update the form data with the selected category
              setFormData(prev => ({
                ...prev,
                category: selectedCat.id
              }));

              // Get entity info
              const entityId = selectedCat.entity_id;

              if (entityId) {
                const entityData = await hierarchyService.getEntityById(entityId);
                if (entityData) {
                  setSelectedEntity(entityData.id);
                  setSelectedEntityName(entityData.name);

                  // Get organization info
                  const orgId = entityData.organization_id;

                  if (orgId) {
                    const orgData = await hierarchyService.getOrganizationById(orgId);
                    if (orgData) {
                      setSelectedOrganization(orgData.id);
                      setSelectedOrganizationName(orgData.name);
                    }
                  }
                }
              }
            }
          } catch (error) {
            console.error('Error loading hierarchy data:', error);
            toast({
              title: "Ongeldige categorie",
              description: "De opgegeven categorie kon niet worden geladen.",
              variant: "destructive"
            });
          }
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the initial data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [categoryId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle breadcrumb selection
  const handleOrganizationChange = (orgId: string, name: string) => {
    setSelectedOrganization(orgId);
    setSelectedOrganizationName(name);

    // Reset subsequent selections
    setSelectedEntity('');
    setSelectedEntityName('');
    setSelectedCategory('');
    setSelectedCategoryName('');

    // Clear category in form data
    setFormData({
      ...formData,
      category: ''
    });
  };

  const handleEntityChange = (entityId: string, name: string) => {
    setSelectedEntity(entityId);
    setSelectedEntityName(name);

    // Reset subsequent selections
    setSelectedCategory('');
    setSelectedCategoryName('');

    // Clear category in form data
    setFormData({
      ...formData,
      category: ''
    });
  };

  const handleCategoryChange = (catId: string, name: string) => {
    setSelectedCategory(catId);
    setSelectedCategoryName(name);

    // Update form data with selected category
    setFormData({
      ...formData,
      category: catId
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    if (!formData.name || !formData.category || !formData.projectNumber || !formData.customer) {
      toast({
        title: "Validatiefout",
        description: "Vul alle verplichte velden in",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      console.log("Submitting project with data:", formData);

      // Check if user is available
      if (!user || !user.id) {
        throw new Error("Je moet ingelogd zijn om een project aan te maken");
      }

      // Format the project data for submission
      const projectData = {
        name: formData.name,
        description: formData.description || '',
        projectNumber: formData.projectNumber,
        status: formData.status,
        startDate: formData.startDate,
        endDate: formData.endDate || null,
        categoryId: formData.category,
        customer: formData.customer,
        projectManager: formData.projectManager || null,
        address: formData.address || '',
        city: formData.city || '',
        buildingPhase: formData.buildingPhase,
        notes: '',
        connectionCount: 0
      };

      console.log("Formatted project data:", projectData);

      // Submit the project with the user's ID
      const newProject = await hierarchyService.addProject(projectData, user.id);

      if (newProject) {
        console.log("Project created successfully:", newProject);
        toast({
          title: "Project aangemaakt",
          description: "Het nieuwe project is succesvol aangemaakt",
        });
        navigate('/projects');
      } else {
        throw new Error("Failed to create project");
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error creating project",
        description: (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <ProjectHeaderSection
          selectedOrganization={selectedOrganization}
          selectedOrganizationName={selectedOrganizationName}
          selectedEntity={selectedEntity}
          selectedEntityName={selectedEntityName}
          selectedCategory={selectedCategory}
          selectedCategoryName={selectedCategoryName}
          onOrganizationChange={handleOrganizationChange}
          onEntityChange={handleEntityChange}
          onCategoryChange={handleCategoryChange}
        />

        {loading ? (
          <LoadingSpinner />
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ProjectFormCard
                  formData={formData}
                  teamMembers={teamMembers}
                  handleChange={handleChange}
                  handleSelectChange={handleSelectChange}
                />

                <ProjectDescriptionSection
                  description={formData.description}
                  handleChange={handleChange}
                  isSubmitting={isSubmitting}
                />
              </div>

              <div className="space-y-6">
                <ProjectSummarySection
                  formData={formData}
                  categories={categories}
                  teamMembers={teamMembers}
                />

                <ProjectHelpSection />
              </div>
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
}
