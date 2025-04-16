
export type BuildPhase = 
  | 'voorbereiding' 
  | 'ontwikkeling' 
  | 'uitvoering' 
  | 'oplevering' 
  | 'beheer'
  | 'planning'
  | 'ontwerp'
  | 'constructie'
  | 'afwerking'
  | 'onderhoud'
  | string;

export type ObjectType = 
  | 'woning' 
  | 'utiliteit' 
  | 'installatie' 
  | 'techniek' 
  | 'bouwvoorziening' 
  | 'overig'
  | string;

export type BuildingPhase = 
  | 'planning' 
  | 'ontwerp' 
  | 'constructie' 
  | 'afwerking' 
  | 'oplevering' 
  | 'onderhoud'
  | 'concept' 
  | 'preparation' 
  | 'execution' 
  | 'completed'
  | string;

export interface Organization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  kvkNumber?: string;
  created_at?: string;
  entities?: Entity[];
}

export interface Entity {
  id: string;
  name: string;
  description?: string;
  organizationId?: string;
  organization_id?: string;
  organization?: Organization;
  created_at?: string;
  categories?: Category[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  entityId?: string;
  entity_id?: string;
  entity?: Entity;
  created_at?: string;
  projects?: Project[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
  address?: string;
  city?: string;
  status?: string;
  categoryId?: string;
  category_id?: string;
  startDate?: string;
  endDate?: string;
  start_date?: string;
  end_date?: string;
  createdBy?: string;
  created_by?: string;
  projectManager?: string;
  project_manager?: string;
  connectionCount?: number;
  projectNumber?: string;
  customer?: string;
  buildingPhase?: BuildingPhase;
  building_phase?: string;
  notes?: string;
  complexes?: Complex[];
}

export interface Complex {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  postal_code?: string;
  projectId?: string;
  project_id?: string;
  created_at?: string;
  updated_at?: string;
  objects?: HierarchyObject[];
}

export interface HierarchyObject {
  id: string;
  name: string;
  projectId?: string;
  project_id?: string;
  complexId?: string;
  complex_id?: string;
  objectType?: ObjectType;
  object_type?: string;
  buildPhase?: BuildPhase;
  build_phase?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  postal_code?: string;
  complexName?: string;
  complex_name?: string;
  connectionCount?: number;
  connectionStatus?: string;
  created_at?: string;
  meters?: Meter[];
  description?: string;
}

export interface Meter {
  id: string;
  name: string;
  type: string;
  role: string;
  status: string;
  ean?: string;
  objectId?: string;
  object_id?: string;
}

export interface HierarchyService {
  // Organizations
  getOrganizations: () => Promise<Organization[]>;
  getOrganizationById: (id: string) => Promise<Organization | null>;
  addOrganization: (data: Partial<Organization>) => Promise<Organization>;
  updateOrganization: (id: string, data: Partial<Organization>) => Promise<Organization>;
  
  // Entities
  getEntities: () => Promise<Entity[]>;
  getEntityById: (id: string) => Promise<Entity | null>;
  getEntitiesByOrganization: (organizationId: string) => Promise<Entity[]>;
  addEntity: (data: Partial<Entity>) => Promise<Entity>;
  updateEntity: (id: string, data: Partial<Entity>) => Promise<Entity>;
  
  // Categories
  getCategories: () => Promise<Category[]>;
  getCategoryById: (id: string) => Promise<Category | null>;
  getCategoriesByEntity: (entityId: string) => Promise<Category[]>;
  addCategory: (data: Partial<Category>) => Promise<Category>;
  updateCategory: (id: string, data: Partial<Category>) => Promise<Category>;
  deleteCategory: (id: string) => Promise<void>;
  
  // Projects
  getProjects: () => Promise<Project[]>;
  getProjectById: (id: string) => Promise<Project>;
  getProjectsByCategory: (categoryId: string) => Promise<Project[]>;
  addProject: (data: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, data: Partial<Project>) => Promise<Project>;
  
  // Complexes
  getComplexes: () => Promise<Complex[]>;
  getComplexById: (id: string) => Promise<Complex | null>;
  getComplexesByProject: (projectId: string) => Promise<Complex[]>;
  addComplex: (data: Partial<Complex>) => Promise<Complex>;
  updateComplex: (id: string, data: Partial<Complex>) => Promise<Complex>;
  deleteComplex: (id: string) => Promise<void>;
  
  // Objects
  getObjects: () => Promise<HierarchyObject[]>;
  getObjectById: (id: string) => Promise<HierarchyObject | null>;
  getObjectsByComplex: (complexId: string) => Promise<HierarchyObject[]>;
  getObjectsByComplexId: (complexId: string) => Promise<HierarchyObject[]>;
  getObjectsByProject: (projectId: string) => Promise<HierarchyObject[]>;
  addObject: (data: Partial<HierarchyObject>) => Promise<HierarchyObject>;
  updateObject: (id: string, data: Partial<HierarchyObject>) => Promise<HierarchyObject>;
  deleteObject: (id: string) => Promise<void>;
}
