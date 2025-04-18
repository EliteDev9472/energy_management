
import { useState, useEffect } from 'react';
import { ChevronRight, Building, FolderTree, Package, Home, Warehouse } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Organization, Entity, Project, Complex, HierarchyObject } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchyService';

interface HierarchyBreadcrumbProps {
  selectedOrganization: string;
  selectedEntity: string;
  selectedProject: string;
  selectedComplex: string;
  selectedObject: string;
  onOrganizationChange: (value: string, name: string) => void;
  onEntityChange: (value: string, name: string) => void;
  onProjectChange: (value: string, name: string) => void;
  onComplexChange: (value: string, name: string) => void;
  onObjectChange: (value: string, name: string) => void;
}

export function HierarchyBreadcrumb({
  selectedOrganization,
  selectedEntity,
  selectedProject,
  selectedComplex,
  selectedObject,
  onOrganizationChange,
  onEntityChange,
  onProjectChange,
  onComplexChange,
  onObjectChange
}: HierarchyBreadcrumbProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [objects, setObjects] = useState<HierarchyObject[]>([]);

  const [orgName, setOrgName] = useState<string>('');
  const [entityName, setEntityName] = useState<string>('');
  const [projectName, setProjectName] = useState<string>('');
  const [complexName, setComplexName] = useState<string>('');
  const [objectName, setObjectName] = useState<string>('');

  const [validationErrors, setValidationErrors] = useState({
    organization: false,
    entity: false,
    project: false,
    complex: false,
    object: false
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await hierarchyService.getOrganizations();
        setOrganizations(orgs);

        if (selectedOrganization) {
          const org = orgs.find(o => o.id === selectedOrganization);
          if (org) setOrgName(org.name);
          setValidationErrors(prev => ({ ...prev, organization: false }));
        }
      } catch (error) {
        console.error('Error loading organizations:', error);
      }
    };

    fetchOrganizations();
  }, [selectedOrganization]);

  useEffect(() => {
    if (selectedOrganization) {
      const fetchEntities = async () => {
        try {
          const ents = await hierarchyService.getEntitiesByOrganization(selectedOrganization);
          setEntities(ents);

          if (selectedEntity) {
            const entity = ents.find(e => e.id === selectedEntity);
            if (entity) setEntityName(entity.name);
            setValidationErrors(prev => ({ ...prev, entity: false }));
          }
        } catch (error) {
          console.error('Error loading entities:', error);
        }
      };

      fetchEntities();
    } else {
      setEntities([]);
      setEntityName('');
    }
  }, [selectedOrganization, selectedEntity]);

  useEffect(() => {
    if (selectedEntity) {
      const fetchProjects = async () => {
        try {
          const categories = await hierarchyService.getCategoriesByEntity(selectedEntity);

          let allProjects: Project[] = [];
          for (const category of categories) {
            const categoryProjects = await hierarchyService.getProjectsByCategory(category.id);
            allProjects = [...allProjects, ...categoryProjects];
          }

          setProjects(allProjects);

          if (selectedProject) {
            const project = allProjects.find(p => p.id === selectedProject);
            if (project) setProjectName(project.name);
            setValidationErrors(prev => ({ ...prev, project: false }));
          }
        } catch (error) {
          console.error('Error loading projects:', error);
        }
      };

      fetchProjects();
    } else {
      setProjects([]);
      setProjectName('');
    }
  }, [selectedEntity, selectedProject]);

  useEffect(() => {
    if (selectedProject) {
      const fetchComplexes = async () => {
        try {
          const cplxList = await hierarchyService.getComplexesByProject(selectedProject);
          setComplexes(cplxList);

          if (selectedComplex) {
            const cplx = cplxList.find(c => c.id === selectedComplex);
            if (cplx) setComplexName(cplx.name);
            setValidationErrors(prev => ({ ...prev, complex: false }));
          }
        } catch (error) {
          console.error('Error loading complexes:', error);
        }
      };

      fetchComplexes();
    } else {
      setComplexes([]);
      setComplexName('');
    }
  }, [selectedProject, selectedComplex]);

  useEffect(() => {
    if (selectedComplex) {
      const fetchObjects = async () => {
        try {
          const objList = await hierarchyService.getObjectsByComplexId(selectedComplex);
          setObjects(objList);

          if (selectedObject) {
            const obj = objList.find(o => o.id === selectedObject);
            if (obj) setObjectName(obj.name);
            setValidationErrors(prev => ({ ...prev, object: false }));
          }
        } catch (error) {
          console.error('Error loading objects:', error);
        }
      };

      fetchObjects();
    } else {
      setObjects([]);
      setObjectName('');
    }
  }, [selectedComplex, selectedObject]);

  const handleSelectOrganization = (orgId: string, name: string) => {
    onOrganizationChange(orgId, name);
    setOrgName(name);
    setValidationErrors(prev => ({ ...prev, organization: false }));

    onEntityChange('', '');
    onProjectChange('', '');
    onComplexChange('', '');
    onObjectChange('', '');
  };

  const handleSelectEntity = (entityId: string, name: string) => {
    onEntityChange(entityId, name);
    setEntityName(name);
    setValidationErrors(prev => ({ ...prev, entity: false }));

    onProjectChange('', '');
    onComplexChange('', '');
    onObjectChange('', '');
  };

  const handleSelectProject = (projectId: string, name: string) => {
    onProjectChange(projectId, name);
    setProjectName(name);
    setValidationErrors(prev => ({ ...prev, project: false }));

    onComplexChange('', '');
    onObjectChange('', '');
  };

  const handleSelectComplex = (complexId: string, name: string) => {
    onComplexChange(complexId, name);
    setComplexName(name);
    setValidationErrors(prev => ({ ...prev, complex: false }));

    onObjectChange('', '');
  };

  const handleSelectObject = (objectId: string, name: string) => {
    onObjectChange(objectId, name);
    setObjectName(name);
    setValidationErrors(prev => ({ ...prev, object: false }));
  };

  const getValidationClass = (field: keyof typeof validationErrors) => {
    return validationErrors[field] ? 'border-red-500 bg-red-50' : '';
  };

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-2">
        Hiërarchie <span className="text-red-500">*</span>
      </h3>

      <Breadcrumb className={`bg-muted/30 p-3 rounded-md ${!selectedOrganization || !selectedEntity || !selectedProject || !selectedComplex || !selectedObject ? 'border border-red-300' : ''}`}>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`h-auto px-2 py-1 text-sm ${!selectedOrganization ? 'border border-dashed border-red-500' : ''}`}
                >
                  <Building className="h-4 w-4 mr-1 text-muted-foreground" />
                  {orgName || "Selecteer organisatie"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Zoek organisatie..." />
                  <CommandList>
                    <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                    <CommandGroup>
                      {organizations.map((org) => (
                        <CommandItem
                          key={org.id}
                          onSelect={() => handleSelectOrganization(org.id, org.name)}
                          className="cursor-pointer"
                        >
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          {org.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </BreadcrumbItem>

          {selectedOrganization && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${!selectedEntity ? 'border border-dashed border-red-500' : ''}`}
                    >
                      <FolderTree className="h-4 w-4 mr-1 text-muted-foreground" />
                      {entityName || "Selecteer entiteit"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Zoek entiteit..." />
                      <CommandList>
                        <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                        <CommandGroup>
                          {entities.map((entity) => (
                            <CommandItem
                              key={entity.id}
                              onSelect={() => handleSelectEntity(entity.id, entity.name)}
                              className="cursor-pointer"
                            >
                              <FolderTree className="h-4 w-4 mr-2 text-muted-foreground" />
                              {entity.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </BreadcrumbItem>
            </>
          )}

          {selectedEntity && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${!selectedProject ? 'border border-dashed border-red-500' : ''}`}
                    >
                      <Package className="h-4 w-4 mr-1 text-muted-foreground" />
                      {projectName || "Selecteer project"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Zoek project..." />
                      <CommandList>
                        <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                        <CommandGroup>
                          {projects.map((project) => (
                            <CommandItem
                              key={project.id}
                              onSelect={() => handleSelectProject(project.id, project.name)}
                              className="cursor-pointer"
                            >
                              <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                              {project.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </BreadcrumbItem>
            </>
          )}

          {selectedProject && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${!selectedComplex ? 'border border-dashed border-red-500' : ''}`}
                    >
                      <Warehouse className="h-4 w-4 mr-1 text-muted-foreground" />
                      {complexName || "Selecteer complex"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Zoek complex..." />
                      <CommandList>
                        <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                        <CommandGroup>
                          {complexes.map((complex) => (
                            <CommandItem
                              key={complex.id}
                              onSelect={() => handleSelectComplex(complex.id, complex.name)}
                              className="cursor-pointer"
                            >
                              <Warehouse className="h-4 w-4 mr-2 text-muted-foreground" />
                              {complex.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </BreadcrumbItem>
            </>
          )}

          {selectedComplex && (
            <>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4" />
              </BreadcrumbSeparator>

              <BreadcrumbItem>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-auto px-2 py-1 text-sm ${!selectedObject ? 'border border-dashed border-red-500' : ''}`}
                    >
                      <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                      {objectName || "Selecteer object"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Zoek object..." />
                      <CommandList>
                        <CommandEmpty>Geen resultaten gevonden</CommandEmpty>
                        <CommandGroup>
                          {objects.map((obj) => (
                            <CommandItem
                              key={obj.id}
                              onSelect={() => handleSelectObject(obj.id, obj.name)}
                              className="cursor-pointer"
                            >
                              <Home className="h-4 w-4 mr-2 text-muted-foreground" />
                              {obj.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </BreadcrumbItem>
            </>
          )}

        </BreadcrumbList>
      </Breadcrumb>

      {(!selectedOrganization || !selectedEntity || !selectedProject || !selectedComplex || !selectedObject) && (
        <p className="text-sm text-red-500 mt-1">
          De complete hiërarchie is verplicht om een aansluiting aan te maken
        </p>
      )}
    </div>
  );
}
