
import { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Grid3X3, 
  Home,
  ChevronRight,
  Search,
  Package,
  FileBox,
  Info
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { hierarchyService, getEntitiesByOrganization, getCategoriesByEntity, getProjectsByCategory, getComplexesByProject, getObjectsByComplex } from '@/services/hierarchy';
import { Organization, Entity, Category, Project, Complex, HierarchyObject } from '@/types/hierarchy';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface HierarchyBreadcrumbProps {
  selectedOrganization: string;
  selectedEntity: string;
  selectedProject: string;
  selectedComplex: string;
  selectedObject: string;
  onOrganizationChange: (id: string, name: string) => void;
  onEntityChange: (id: string, name: string) => void;
  onProjectChange: (id: string, name: string) => void;
  onComplexChange: (id: string, name: string) => void;
  onObjectChange: (id: string, name: string) => void;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [objects, setObjects] = useState<HierarchyObject[]>([]);

  const [organizationName, setOrganizationName] = useState('');
  const [entityName, setEntityName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [complexName, setComplexName] = useState('');
  const [objectName, setObjectName] = useState('');

  // Search states
  const [orgSearchTerm, setOrgSearchTerm] = useState('');
  const [entitySearchTerm, setEntitySearchTerm] = useState('');
  const [projectSearchTerm, setProjectSearchTerm] = useState('');
  const [complexSearchTerm, setComplexSearchTerm] = useState('');
  const [objectSearchTerm, setObjectSearchTerm] = useState('');

  // Dropdown states
  const [orgDropdownOpen, setOrgDropdownOpen] = useState(false);
  const [entityDropdownOpen, setEntityDropdownOpen] = useState(false);
  const [projectDropdownOpen, setProjectDropdownOpen] = useState(false);
  const [complexDropdownOpen, setComplexDropdownOpen] = useState(false);
  const [objectDropdownOpen, setObjectDropdownOpen] = useState(false);

  // Refs for handling outside clicks
  const orgDropdownRef = useRef<HTMLDivElement>(null);
  const entityDropdownRef = useRef<HTMLDivElement>(null);
  const projectDropdownRef = useRef<HTMLDivElement>(null);
  const complexDropdownRef = useRef<HTMLDivElement>(null);
  const objectDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await hierarchyService.getOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Error fetching organizations:", error);
        toast({ 
          title: "Fout bij ophalen organisaties",
          description: "Kon organisaties niet laden.", 
          variant: "destructive" 
        });
      }
    };

    fetchOrganizations();
  }, []);

  useEffect(() => {
    const fetchEntities = async () => {
      if (!selectedOrganization) return;
      
      try {
        if (!organizationName) {
          const org = await hierarchyService.getOrganizationById(selectedOrganization);
          if (org) {
            setOrganizationName(org.name);
          }
        }
        
        const ents = await getEntitiesByOrganization(selectedOrganization);
        setEntities(ents);
      } catch (error) {
        console.error("Error fetching entities:", error);
        toast({ 
          title: "Fout bij ophalen entiteiten",
          description: "Kon entiteiten niet laden.", 
          variant: "destructive" 
        });
      }
    };

    fetchEntities();
  }, [selectedOrganization, organizationName]);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedEntity) return;
      
      try {
        if (!entityName) {
          const entity = await hierarchyService.getEntityById(selectedEntity);
          if (entity) {
            setEntityName(entity.name);
          }
        }
        
        const cats = await getCategoriesByEntity(selectedEntity);
        setCategories(cats);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({ 
          title: "Fout bij ophalen categorieën",
          description: "Kon categorieën niet laden.", 
          variant: "destructive" 
        });
      }
    };

    fetchCategories();
  }, [selectedEntity, entityName]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        if (selectedEntity) {
          const projectList = await getProjectsByCategory(selectedEntity);
          setProjects(projectList);
        }
        
        if (selectedProject && !projectName) {
          try {
            const project = await hierarchyService.getProjectById(selectedProject);
            if (project) {
              setProjectName(project.name);
            }
          } catch (err) {
            console.error("Error getting project by ID:", err);
          }
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
        toast({ 
          title: "Fout bij ophalen projecten",
          description: "Kon projecten niet laden.", 
          variant: "destructive" 
        });
      }
    };
    
    fetchProjects();
  }, [selectedEntity, selectedProject, projectName]);

  useEffect(() => {
    const fetchComplexes = async () => {
      if (!selectedProject) return;
      
      try {
        const cmplxs = await getComplexesByProject(selectedProject);
        setComplexes(cmplxs);
        
        if (selectedComplex && !complexName) {
          const complex = await hierarchyService.getComplexById(selectedComplex);
          if (complex) {
            setComplexName(complex.name);
          }
        }
      } catch (error) {
        console.error("Error fetching complexes:", error);
        toast({ 
          title: "Fout bij ophalen complexen",
          description: "Kon complexen niet laden.", 
          variant: "destructive" 
        });
      }
    };

    fetchComplexes();
  }, [selectedProject, selectedComplex, complexName]);

  useEffect(() => {
    const fetchObjects = async () => {
      if (!selectedComplex) return;
      
      try {
        const objs = await getObjectsByComplex(selectedComplex);
        setObjects(objs);
        
        if (selectedObject && !objectName) {
          const object = await hierarchyService.getObjectById(selectedObject);
          if (object) {
            setObjectName(object.name);
          }
        }
      } catch (error) {
        console.error("Error fetching objects:", error);
        toast({ 
          title: "Fout bij ophalen objecten",
          description: "Kon objecten niet laden.", 
          variant: "destructive" 
        });
      }
    };

    fetchObjects();
  }, [selectedComplex, selectedObject, objectName]);

  // Handle outside clicks to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(event.target as Node)) {
        setOrgDropdownOpen(false);
      }
      if (entityDropdownRef.current && !entityDropdownRef.current.contains(event.target as Node)) {
        setEntityDropdownOpen(false);
      }
      if (projectDropdownRef.current && !projectDropdownRef.current.contains(event.target as Node)) {
        setProjectDropdownOpen(false);
      }
      if (complexDropdownRef.current && !complexDropdownRef.current.contains(event.target as Node)) {
        setComplexDropdownOpen(false);
      }
      if (objectDropdownRef.current && !objectDropdownRef.current.contains(event.target as Node)) {
        setObjectDropdownOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Filter functions
  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(orgSearchTerm.toLowerCase())
  );
  
  const filteredEntities = entities.filter(entity =>
    entity.name.toLowerCase().includes(entitySearchTerm.toLowerCase())
  );
  
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(projectSearchTerm.toLowerCase())
  );
  
  const filteredComplexes = complexes.filter(complex =>
    complex.name.toLowerCase().includes(complexSearchTerm.toLowerCase())
  );
  
  const filteredObjects = objects.filter(obj =>
    obj.name.toLowerCase().includes(objectSearchTerm.toLowerCase())
  );

  // Selection handlers
  const handleOrganizationSelect = (id: string, name: string) => {
    setOrganizationName(name);
    onOrganizationChange(id, name);
    setOrgDropdownOpen(false);
    setOrgSearchTerm('');
  };

  const handleEntitySelect = (id: string, name: string) => {
    setEntityName(name);
    onEntityChange(id, name);
    setEntityDropdownOpen(false);
    setEntitySearchTerm('');
  };

  const handleProjectSelect = (id: string, name: string) => {
    setProjectName(name);
    onProjectChange(id, name);
    setProjectDropdownOpen(false);
    setProjectSearchTerm('');
  };

  const handleComplexSelect = (id: string, name: string) => {
    setComplexName(name);
    onComplexChange(id, name);
    setComplexDropdownOpen(false);
    setComplexSearchTerm('');
  };

  const handleObjectSelect = (id: string, name: string) => {
    setObjectName(name);
    onObjectChange(id, name);
    setObjectDropdownOpen(false);
    setObjectSearchTerm('');
  };

  return (
    <div className="mb-4">
      <div className="mb-2 flex items-center">
        <h3 className="text-sm font-medium text-gray-700 mr-1">Hiërarchie</h3>
        <span className="text-red-500">*</span>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" className="h-6 w-6 p-0 ml-1">
                <Info className="h-4 w-4 text-gray-400" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Een EAN-code (European Article Number) is een uniek 18-cijferig nummer voor uw aansluiting.</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <div className="flex flex-wrap items-center gap-1">
        {/* Organization selector */}
        <div className="relative" ref={orgDropdownRef}>
          <button
            type="button"
            className="flex items-center h-9 gap-1 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            onClick={() => setOrgDropdownOpen(!orgDropdownOpen)}
          >
            <FileBox className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{organizationName || "Selecteer organisatie"}</span>
            <ChevronRight className="h-3 w-3 text-gray-500" />
          </button>

          {orgDropdownOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 w-60 bg-white border border-gray-200 rounded shadow-lg">
              <div className="p-2">
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Zoek organisatie..."
                    className="pl-8 h-8 text-sm"
                    value={orgSearchTerm}
                    onChange={(e) => setOrgSearchTerm(e.target.value)}
                  />
                </div>
                <ScrollArea className="h-32">
                  {filteredOrganizations.length > 0 ? (
                    <div className="flex flex-col">
                      {filteredOrganizations.map((org) => (
                        <button
                          key={org.id}
                          type="button"
                          className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                          onClick={() => handleOrganizationSelect(org.id, org.name)}
                        >
                          <FileBox className="h-3.5 w-3.5 mr-2 text-gray-500" />
                          <span>{org.name}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2 text-center text-gray-500 text-sm">
                      Geen organisaties gevonden
                    </div>
                  )}
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {selectedOrganization && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {/* Entity selector */}
            <div className="relative" ref={entityDropdownRef}>
              <button
                type="button"
                className="flex items-center h-9 gap-1 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setEntityDropdownOpen(!entityDropdownOpen)}
              >
                <Grid3X3 className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{entityName || "Selecteer entiteit"}</span>
                <ChevronRight className="h-3 w-3 text-gray-500" />
              </button>

              {entityDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 w-60 bg-white border border-gray-200 rounded shadow-lg">
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Zoek entiteit..."
                        className="pl-8 h-8 text-sm"
                        value={entitySearchTerm}
                        onChange={(e) => setEntitySearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-32">
                      {filteredEntities.length > 0 ? (
                        <div className="flex flex-col">
                          {filteredEntities.map((entity) => (
                            <button
                              key={entity.id}
                              type="button"
                              className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                              onClick={() => handleEntitySelect(entity.id, entity.name)}
                            >
                              <Grid3X3 className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              <span>{entity.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">
                          Geen entiteiten gevonden
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {selectedEntity && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {/* Project selector */}
            <div className="relative" ref={projectDropdownRef}>
              <button
                type="button"
                className="flex items-center h-9 gap-1 px-2 py-1 text-gray-700 bg-white border border-blue-400 rounded hover:bg-gray-50"
                onClick={() => setProjectDropdownOpen(!projectDropdownOpen)}
              >
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{projectName || "Selecteer project"}</span>
                <ChevronRight className="h-3 w-3 text-gray-500" />
              </button>

              {projectDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 w-60 bg-white border border-gray-200 rounded shadow-lg">
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Zoek project..."
                        className="pl-8 h-8 text-sm"
                        value={projectSearchTerm}
                        onChange={(e) => setProjectSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-32">
                      {filteredProjects.length > 0 ? (
                        <div className="flex flex-col">
                          {filteredProjects.map((project) => (
                            <button
                              key={project.id}
                              type="button"
                              className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                              onClick={() => handleProjectSelect(project.id, project.name)}
                            >
                              <Package className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              <span>{project.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">
                          Geen projecten gevonden
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {selectedProject && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {/* Complex selector */}
            <div className="relative" ref={complexDropdownRef}>
              <button
                type="button"
                className="flex items-center h-9 gap-1 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setComplexDropdownOpen(!complexDropdownOpen)}
              >
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{complexName || "Selecteer complex"}</span>
                <ChevronRight className="h-3 w-3 text-gray-500" />
              </button>

              {complexDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 w-60 bg-white border border-gray-200 rounded shadow-lg">
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Zoek complex..."
                        className="pl-8 h-8 text-sm"
                        value={complexSearchTerm}
                        onChange={(e) => setComplexSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-32">
                      {filteredComplexes.length > 0 ? (
                        <div className="flex flex-col">
                          {filteredComplexes.map((complex) => (
                            <button
                              key={complex.id}
                              type="button"
                              className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                              onClick={() => handleComplexSelect(complex.id, complex.name)}
                            >
                              <Home className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              <span>{complex.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">
                          Geen complexen gevonden
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {selectedComplex && (
          <>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            {/* Object selector */}
            <div className="relative" ref={objectDropdownRef}>
              <button
                type="button"
                className="flex items-center h-9 gap-1 px-2 py-1 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
                onClick={() => setObjectDropdownOpen(!objectDropdownOpen)}
              >
                <Home className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{objectName || "Selecteer object"}</span>
                <ChevronRight className="h-3 w-3 text-gray-500" />
              </button>

              {objectDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 z-50 w-60 bg-white border border-gray-200 rounded shadow-lg">
                  <div className="p-2">
                    <div className="relative mb-2">
                      <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Zoek object..."
                        className="pl-8 h-8 text-sm"
                        value={objectSearchTerm}
                        onChange={(e) => setObjectSearchTerm(e.target.value)}
                      />
                    </div>
                    <ScrollArea className="h-32">
                      {filteredObjects.length > 0 ? (
                        <div className="flex flex-col">
                          {filteredObjects.map((object) => (
                            <button
                              key={object.id}
                              type="button"
                              className="flex items-center px-2 py-1.5 text-sm text-gray-700 hover:bg-blue-50 rounded"
                              onClick={() => handleObjectSelect(object.id, object.name)}
                            >
                              <Home className="h-3.5 w-3.5 mr-2 text-gray-500" />
                              <span>{object.name}</span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-2 text-center text-gray-500 text-sm">
                          Geen objecten gevonden
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Validation message - more compact */}
      {(!selectedOrganization || !selectedEntity || !selectedProject) && (
        <div className="text-sm text-red-500 mt-1">
          De complete hiërarchie is verplicht
        </div>
      )}
    </div>
  );
}
