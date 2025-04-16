// Fix the typing issues for this file
import { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { hierarchyService } from '@/services/hierarchyService';

interface OrganizationFieldsProps {
  selectedOrganization: string;
  onOrganizationChange: (value: string) => void;
  selectedEntity: string;
  onEntityChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  selectedProject: string;
  onProjectChange: (value: string) => void;
  selectedObject: string;
  onObjectChange: (value: string) => void;
}

export function OrganizationFields({
  selectedOrganization,
  onOrganizationChange,
  selectedEntity,
  onEntityChange,
  selectedCategory,
  onCategoryChange,
  selectedProject,
  onProjectChange,
  selectedObject,
  onObjectChange,
}: OrganizationFieldsProps) {
  const [organizations, setOrganizations] = useState([]);
  const [entities, setEntities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [objects, setObjects] = useState([]);

  // Update the problematic functions to cast the data to the right type
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const fetchedOrgs = await hierarchyService.getOrganizations();
        setOrganizations(fetchedOrgs as any[]);  // Type casting to avoid type errors
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
        setEntities(fetchedEntities as any[]);  // Type casting
      } catch (error) {
        console.error(`Error fetching entities for organization ${selectedOrganization}:`, error);
      }
    };

    fetchEntities();
  }, [selectedOrganization]);

  // Similar approach for the other fetching functions
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedEntity) return;
    
      try {
        const fetchedCategories = await hierarchyService.getCategoriesByEntity(selectedEntity);
        setCategories(fetchedCategories as any[]);
      } catch (error) {
        console.error(`Error fetching categories for entity ${selectedEntity}:`, error);
      }
    };

    const fetchProjects = async () => {
      if (!selectedCategory) return;
    
      try {
        const fetchedProjects = await hierarchyService.getProjectsByCategory(selectedCategory);
        setProjects(fetchedProjects as any[]);
      } catch (error) {
        console.error(`Error fetching projects for category ${selectedCategory}:`, error);
      }
    };

    if (selectedEntity) {
      fetchCategories();
    }
  
    if (selectedCategory) {
      fetchProjects();
    }
  }, [selectedEntity, selectedCategory]);

  useEffect(() => {
    const fetchObjects = async () => {
      if (!selectedProject) return;
    
      try {
        const fetchedObjects = await hierarchyService.getObjectsByProject(selectedProject);
        setObjects(fetchedObjects as any[]);
      } catch (error) {
        console.error(`Error fetching objects for project ${selectedProject}:`, error);
      }
    };

    if (selectedProject) {
      fetchObjects();
    }
  }, [selectedProject]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <Label htmlFor="organization">Organisatie</Label>
        <Select value={selectedOrganization} onValueChange={onOrganizationChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer organisatie" />
          </SelectTrigger>
          <SelectContent>
            {organizations.map((org: any) => (
              <SelectItem key={org.id} value={org.id}>
                {org.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="entity">Entiteit</Label>
        <Select value={selectedEntity} onValueChange={onEntityChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer entiteit" />
          </SelectTrigger>
          <SelectContent>
            {entities.map((entity: any) => (
              <SelectItem key={entity.id} value={entity.id}>
                {entity.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="category">Categorie</Label>
        <Select value={selectedCategory} onValueChange={onCategoryChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer categorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: any) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="project">Project</Label>
        <Select value={selectedProject} onValueChange={onProjectChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer project" />
          </SelectTrigger>
          <SelectContent>
            {projects.map((project: any) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="object">Object</Label>
        <Select value={selectedObject} onValueChange={onObjectChange}>
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Selecteer object" />
          </SelectTrigger>
          <SelectContent>
            {objects.map((object: any) => (
              <SelectItem key={object.id} value={object.id}>
                {object.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
