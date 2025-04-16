
import { useState, useEffect } from 'react';
import { hierarchyService } from '@/services/hierarchy';
import { Card } from '@/components/ui/card';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Building, 
  ChevronRight, 
  FolderClosed, 
  Grid3X3, 
  Package
} from 'lucide-react';
import { Organization, Entity, Category } from '@/types/hierarchy';

interface ProjectBreadcrumbProps {
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

export const ProjectBreadcrumb = ({
  selectedOrganization,
  selectedOrganizationName,
  selectedEntity,
  selectedEntityName,
  selectedCategory,
  selectedCategoryName,
  onOrganizationChange,
  onEntityChange,
  onCategoryChange
}: ProjectBreadcrumbProps) => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState({
    organizations: false,
    entities: false,
    categories: false
  });

  // Fetch organizations
  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(prev => ({ ...prev, organizations: true }));
      try {
        const orgs = await hierarchyService.getOrganizations();
        setOrganizations(orgs);
        
        if (orgs.length > 0 && !selectedOrganization) {
          const firstOrg = orgs[0];
          onOrganizationChange(firstOrg.id, firstOrg.name);
        }
      } catch (error) {
        console.error('Error fetching organizations', error);
      } finally {
        setLoading(prev => ({ ...prev, organizations: false }));
      }
    };
    
    fetchOrganizations();
  }, []);

  // Fetch entities when organization changes
  useEffect(() => {
    const fetchEntities = async () => {
      if (!selectedOrganization) return;
      
      setLoading(prev => ({ ...prev, entities: true }));
      try {
        const fetchedEntities = await hierarchyService.getEntitiesByOrganization(selectedOrganization);
        setEntities(fetchedEntities);
        
        if (fetchedEntities.length > 0 && !selectedEntity) {
          const firstEntity = fetchedEntities[0];
          onEntityChange(firstEntity.id, firstEntity.name);
        }
      } catch (error) {
        console.error('Error fetching entities', error);
      } finally {
        setLoading(prev => ({ ...prev, entities: false }));
      }
    };
    
    fetchEntities();
  }, [selectedOrganization]);

  // Fetch categories when entity changes
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedEntity) return;
      
      setLoading(prev => ({ ...prev, categories: true }));
      try {
        const fetchedCategories = await hierarchyService.getCategoriesByEntity(selectedEntity);
        setCategories(fetchedCategories);
        
        if (fetchedCategories.length > 0 && !selectedCategory) {
          const firstCategory = fetchedCategories[0];
          onCategoryChange(firstCategory.id, firstCategory.name);
        }
      } catch (error) {
        console.error('Error fetching categories', error);
      } finally {
        setLoading(prev => ({ ...prev, categories: false }));
      }
    };
    
    fetchCategories();
  }, [selectedEntity]);

  // Event handlers
  const handleOrganizationChange = (orgId: string) => {
    const org = organizations.find(o => o.id === orgId);
    if (org) {
      onOrganizationChange(org.id, org.name);
      onEntityChange('', '');
      onCategoryChange('', '');
    }
  };

  const handleEntityChange = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    if (entity) {
      onEntityChange(entity.id, entity.name);
      onCategoryChange('', '');
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      onCategoryChange(category.id, category.name);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-2 min-w-[200px]">
          <Building className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedOrganization} onValueChange={handleOrganizationChange}>
            <SelectTrigger className={loading.organizations ? 'opacity-50' : ''} disabled={loading.organizations}>
              <SelectValue placeholder="Kies organisatie" />
            </SelectTrigger>
            <SelectContent>
              {organizations.map(org => (
                <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block" />
        
        <div className="flex items-center gap-2 min-w-[200px]">
          <Grid3X3 className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={selectedEntity} 
            onValueChange={handleEntityChange}
            disabled={!selectedOrganization || loading.entities}
          >
            <SelectTrigger className={loading.entities ? 'opacity-50' : ''}>
              <SelectValue placeholder="Kies entiteit" />
            </SelectTrigger>
            <SelectContent>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block" />
        
        <div className="flex items-center gap-2 min-w-[200px]">
          <FolderClosed className="h-4 w-4 text-muted-foreground" />
          <Select 
            value={selectedCategory} 
            onValueChange={handleCategoryChange}
            disabled={!selectedEntity || loading.categories}
          >
            <SelectTrigger className={loading.categories ? 'opacity-50' : ''}>
              <SelectValue placeholder="Kies categorie" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block" />
        
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Nieuw Project</span>
        </div>
      </div>
    </Card>
  );
};
