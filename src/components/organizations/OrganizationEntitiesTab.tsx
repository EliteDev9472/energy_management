
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Plus, MoreHorizontal, Building2 } from 'lucide-react';
import { EntityCreateDialog } from './EntityCreateDialog';
import { hierarchyService } from '@/services/hierarchy';
import { Entity } from '@/types/hierarchy';
import { mapDbToEntity } from '@/services/hierarchy/helpers';

interface OrganizationEntitiesTabProps {
  organizationId: string;
  organizationName: string;
}

export function OrganizationEntitiesTab({ organizationId, organizationName }: OrganizationEntitiesTabProps) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const navigate = useNavigate();

  // Fetch entities for the organization
  useEffect(() => {
    const fetchEntities = async () => {
      if (!organizationId) return;

      setIsLoading(true);
      try {
        const data = await hierarchyService.getEntitiesByOrganization(organizationId);
        // Map database entities to Entity type
        const mappedEntities = data.map(entity => mapDbToEntity(entity));
        setEntities(mappedEntities);
      } catch (error) {
        console.error('Error fetching entities:', error);
        toast({
          title: 'Error loading entities',
          description: 'Failed to load entities for this organization.',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntities();
  }, [organizationId]);

  const handleCreateEntity = async (entityData: { name: string; description: string }) => {
    try {
      const newEntity = await hierarchyService.addEntity({
        name: entityData.name,
        description: entityData.description,
        organization_id: organizationId
      });

      setEntities(prev => [...prev, mapDbToEntity(newEntity)]);

      toast({
        title: 'Entity created',
        description: `${entityData.name} has been created successfully.`
      });

      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating entity:', error);
      toast({
        title: 'Error creating entity',
        description: 'There was a problem creating the entity. Please try again.',
        variant: 'destructive'
      });
    }
  };
  const goToEntityDetail = (entityId: string) => {
    navigate(`/entities/${entityId}`);
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Entiteiten</h3>
        <Button
          onClick={() => setShowCreateDialog(true)}
          className="bg-cedrus-accent hover:bg-cedrus-accent/90"
        >
          <Plus className="mr-2 h-4 w-4" /> Nieuwe Entiteit
        </Button>
      </div>

      {isLoading ? (
        <div className="p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Entiteiten laden...</p>
        </div>
      ) : entities.length === 0 ? (
        <div className="p-12 text-center border rounded-lg">
          <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Geen Entiteiten Gevonden</h3>
          <p className="text-muted-foreground mb-4">
            Deze organisatie heeft nog geen entiteiten. Maak een nieuwe entiteit aan om te beginnen.
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="mr-2 h-4 w-4" /> Entiteit Toevoegen
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {entities.map((entity) => (
            <Card key={entity.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => goToEntityDetail(entity.id)} >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-cedrus-accent" />
                  {entity.name}
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {entity.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>

              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => navigate(`/entities/${entity.id}`)}>
                  Details
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )
      }

      {
        showCreateDialog && (
          <EntityCreateDialog
            open={showCreateDialog}
            onClose={() => setShowCreateDialog(false)}
            onSubmit={handleCreateEntity}
            organizationName={organizationName}
          />
        )
      }
    </div >
  );
}
