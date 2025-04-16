
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Building, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Entity, Organization } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';

export default function EntitiesPage() {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get all entities
        const entitiesData = await hierarchyService.getEntities();
        
        // Get categories for each entity
        const entitiesWithCategories = await Promise.all(
          entitiesData.map(async (entity) => {
            try {
              const categories = await hierarchyService.getCategoriesByEntity(entity.id);
              return {
                ...entity,
                categories: categories
              };
            } catch (error) {
              console.error(`Error fetching categories for entity ${entity.id}:`, error);
              return {
                ...entity,
                categories: []
              };
            }
          })
        );
        
        // Fetch organization info for each entity
        const entitiesWithOrgInfo = await Promise.all(
          entitiesWithCategories.map(async (entity) => {
            if (entity.organization) {
              const orgId = typeof entity.organization === 'string' ? entity.organization : entity.organization.id;
              try {
                const org = await hierarchyService.getOrganizationById(orgId);
                if (org) {
                  return {
                    ...entity,
                    organizationName: org.name
                  };
                }
              } catch (error) {
                console.error(`Error fetching organization for entity ${entity.id}:`, error);
              }
            }
            return entity;
          })
        );
        
        setEntities(entitiesWithOrgInfo);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast({
          title: "Error loading entities",
          description: "There was a problem loading the entities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const getOrganizationName = (entity: Entity) => {
    if (!entity.organization) return 'No organization';
    
    if (typeof entity.organization === 'string') {
      return entity.organizationName || entity.organization;
    }
    
    return entity.organization.name;
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Entiteiten</h1>
            <p className="text-muted-foreground mt-1">
              Beheer uw entiteiten binnen organisaties
            </p>
          </div>
          <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={() => navigate('/entities/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nieuwe Entiteit
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Laden...</p>
          </div>
        ) : entities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen entiteiten gevonden</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/entities/new')}
            >
              Eerste entiteit toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {entities.map((entity) => (
              <Card key={entity.id} className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/entities/${entity.id}`)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-cedrus-accent" />
                    {entity.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {getOrganizationName(entity)}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {entity.categories?.length || 0} categorieën
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
