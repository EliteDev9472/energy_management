
// Update the Object interface to be renamed as HierarchyObject
export interface HierarchyObject {
  id: string;
  name: string;
  address?: string;
  city?: string;
  postalCode?: string;
  postal_code?: string; // Database field
  projectId?: string;
  project_id?: string; // Database field
  complexId: string; // For code compatibility
  complex_id?: string; // Database field
  complexName?: string;
  objectType?: ObjectType | string;
  object_type?: string; // Database field
  buildPhase?: BuildPhase | string;
  build_phase?: string; // Database field
  meters?: any[];
  connectionCount?: number;
  connectionStatus?: string;
  project?: Project;
  complex?: Complex;
  description?: string;
  projectName?: string; // For display purposes
  categoryId?: string; // For reference to parent category
  categoryName?: string; // For display purposes
  entityId?: string; // For reference to parent entity
  entityName?: string; // For display purposes
  organizationId?: string; // For reference to parent organization
  organizationName?: string; // For display purposes
  created_at?: string; // Database field
}

// Update the existing type definitions
export type ObjectType = 'woning' | 'utiliteit' | 'installatie' | 'techniek' | 'bouwvoorziening' | 'overig' | string;
export type BuildPhase = 'voorbereiding' | 'ontwikkeling' | 'uitvoering' | 'oplevering' | 'beheer' |
  'planning' | 'ontwerp' | 'constructie' | 'afwerking' | 'onderhoud' | string;

// Building phase enumeration for projects 
// Ensure this aligns with the project.ts BuildingPhase
export type BuildingPhase = 'planning' | 'ontwerp' | 'constructie' | 'afwerking' | 'oplevering' | 'onderhoud' |
  'concept' | 'preparation' | 'execution' | 'completed' | string;

// Define new Complex interface
export interface Complex {
  id: string;
  name: string;
  address: string;
  city: string;
  postalcode: string;
  postal_code?: string; // Database field
  description?: string;
  projectId: string;
  project_id?: string; // Database field
  projectName?: string; // For display purposes
  objects?: HierarchyObject[]; // Updated from Object to HierarchyObject
  categoryId?: string; // For reference to parent category
  categoryName?: string; // For display purposes
  entityId?: string; // For reference to parent entity
  entityName?: string; // For display purposes
  organizationId?: string; // For reference to parent organization
  organizationName?: string; // For display purposes
  createdAt?: string; // For code compatibility
  created_at?: string; // Database field
  updatedAt?: string; // For code compatibility
  updated_at?: string; // Database field
}

// Define the main hierarchical structure types
export interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  vat_number?: string;
  owner_name?: string;
  owner_email?: string;
  entities: Entity[];
  created_at?: string; // Database field
}

export interface Entity {
  id: string;
  name: string;
  description: string;
  organization_id: string; // Database field
  organizationId?: string; // Alias for organization_id for compatibility
  organization?: string; // organization name for display purposes
  categories: Category[];
  organizationName?: string; // For display purposes
  created_at?: string; // Database field
}

export interface Category {
  id: string;
  name: string;
  description: string;
  entity_id: string; // Database field
  entityId?: string; // Alias for entity_id for compatibility
  projects: Project[];
  entityName?: string; // For display purposes only
  organizationName?: string; // For display purposes only
  entity?: { // Add entity property for compatibility
    id: string;
    name: string;
  };
  created_at?: string; // Database field
}

export interface Project {
  id: string;
  name: string;
  projectNumber?: string;
  description?: string;
  status: "concept" | "in_aanvraag" | "lopend" | "afgerond";
  startDate: string;
  start_date?: string; // Database field
  endDate?: string | null;
  end_date?: string; // Database field
  categoryId: string;
  category_id?: string; // Database field
  categoryName?: string; // For display purposes
  complexes?: Complex[]; // Update to include complexes
  objects?: HierarchyObject[]; // Updated from Object to HierarchyObject
  customer?: string;
  projectManager?: string;
  project_manager?: string; // Database field
  city?: string;
  address?: string;
  buildingPhase?: BuildingPhase;
  building_phase?: string; // Database field
  notes?: string;
  connectionCount?: number;
  connection_count?: number; // Database field
  createdAt: string;
  created_at?: string; // Database field
  updatedAt: string;
  updated_at?: string; // Database field
  created_by?: string; // Database field
}

// Service interface for hierarchy
export interface HierarchyService {
  // Organizations
  getOrganizations: () => Promise<Organization[]>;
  getOrganizationById: (id: string) => Promise<Organization | null>;
  addOrganization: (org: Omit<Organization, "id" | "entities">) => Promise<Organization>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization>;

  // Entities
  getEntities: () => Promise<Entity[]>;
  getEntityById: (id: string) => Promise<Entity | null>;
  getEntitiesByOrganization: (organizationId: string) => Promise<Entity[]>;
  addEntity: (entity: Omit<Entity, "id" | "categories">) => Promise<Entity>;
  updateEntity: (id: string, data: Partial<Entity>) => Promise<Entity>;

  // Categories
  getCategories: () => Promise<Category[]>;
  getCategoryById: (id: string) => Promise<Category | null>;
  getCategoriesByEntity: (entityId: string) => Promise<Category[]>;
  addCategory: (category: Omit<Category, "id" | "projects">) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;

  // Projects
  getProjects: () => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  getProjectsByCategory: (categoryId: string) => Promise<Project[]>;
  addProject: (project: Omit<Project, "id" | "complexes" | "objects" | "categoryName" | "createdAt" | "updatedAt"> & { categoryId: string }, userId?: string) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;

  // Complexes
  getComplexes: () => Promise<Complex[]>;
  getComplexById: (id: string) => Promise<Complex | null>;
  getComplexesByProject: (projectId: string) => Promise<Complex[]>;
  addComplex: (complex: Omit<Complex, "id" | "objects">) => Promise<Complex>;
  updateComplex: (id: string, data: Partial<Complex>) => Promise<Complex>;
  deleteComplex: (id: string) => Promise<void>;

  // Objects
  getObjects: () => Promise<HierarchyObject[]>;
  getObjectById: (id: string) => Promise<HierarchyObject | null>;
  getObjectsByComplex: (complexId: string) => Promise<HierarchyObject[]>;
  getObjectsByComplexId: (complexId: string) => Promise<HierarchyObject[]>; // Alias for getObjectsByComplex
  getObjectsByProject: (projectId: string) => Promise<HierarchyObject[]>;
  addObject: (object: Omit<HierarchyObject, "id" | "meters" | "connectionCount" | "connectionStatus">) => Promise<HierarchyObject>;
  updateObject: (id: string, data: Partial<HierarchyObject>) => Promise<HierarchyObject>;
  deleteObject: (id: string) => Promise<void>;
}

// Hierarchy Validation Service interface
export interface HierarchyValidationService {
  validateFullHierarchy: (itemInfo: {
    objectId?: string;
    complexId?: string;
    projectId?: string;
    categoryId?: string;
    entityId?: string;
    organizationId?: string;
  }, itemType: 'connection' | 'meter' | 'document') => Promise<boolean>;

  getHierarchyPath: (id: string, type: "object" | "complex" | "project" | "category" | "entity") => Promise<any>;

  validateProjectBelongsToCategory: (projectId: string, categoryId: string) => Promise<boolean>;

  getProjectCategoryId: (projectId: string) => Promise<string | null>;

  validateObjectBelongsToComplex: (objectId: string, complexId: string) => Promise<boolean>;

  validateComplexBelongsToProject: (complexId: string, projectId: string) => Promise<boolean>;

  validateCategoryBelongsToEntity: (categoryId: string, entityId: string) => Promise<boolean>;

  validateEntityBelongsToOrganization: (entityId: string, organizationId: string) => Promise<boolean>;

  validateProject: (project: string | any) => Promise<boolean>;
}
