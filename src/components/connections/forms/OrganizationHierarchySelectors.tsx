
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { hierarchyService } from '@/services/hierarchyService';
import { Organization, Entity } from '@/types/hierarchy';

interface OrganizationHierarchySelectorProps {
  selectedOrganization: string;
  selectedEntity: string;
  onOrganizationChange: (value: string) => void;
  onEntityChange: (value: string) => void;
}

export function OrganizationHierarchySelectors({
  selectedOrganization,
  selectedEntity,
  onOrganizationChange,
  onEntityChange,
}: OrganizationHierarchySelectorProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const fetchedOrgs = await hierarchyService.getOrganizations();
        // Transform the data to match the Organization type
        const orgsWithEntities = fetchedOrgs.map(org => ({
          ...org,
          entities: [] // Initialize with empty entities array
        })) as Organization[];
        setOrganizations(orgsWithEntities);
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchEntities = async () => {
      if (!selectedOrganization) return;
      
      try {
        const fetchedEntities = await hierarchyService.getEntitiesByOrganization(selectedOrganization);
        // Transform the data to match the Entity type
        const entitiesWithCategories = fetchedEntities.map(entity => ({
          ...entity,
          categories: [] // Initialize with empty categories array
        })) as Entity[];
        setEntities(entitiesWithCategories);
      } catch (error) {
        console.error(`Error fetching entities for organization ${selectedOrganization}:`, error);
      }
    };

    fetchEntities();
  }, [selectedOrganization]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label htmlFor="organization">Organisatie</Label>
        <Select value={selectedOrganization} onValueChange={onOrganizationChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer een organisatie" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map(org => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="entity">Entiteit</Label>
        <Select 
          value={selectedEntity} 
          onValueChange={onEntityChange}
          disabled={!selectedOrganization || entities.length === 0}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer een entiteit" />
          </SelectTrigger>
          <SelectContent>
            {entities.map(entity => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
