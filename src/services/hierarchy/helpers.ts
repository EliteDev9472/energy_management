
import { Entity, Category, Project, Complex, HierarchyObject } from '@/types/hierarchy';

// Map database entity to TypeScript entity
export const mapDbToEntity = (dbEntity: any): Entity => {
  return {
    id: dbEntity.id,
    name: dbEntity.name,
    description: dbEntity.description || '',
    organization_id: dbEntity.organization_id || dbEntity.organizationid,
    organizationId: dbEntity.organization_id || dbEntity.organizationid,
    categories: [], // This should be populated separately if needed
    created_at: dbEntity.created_at
  };
};

// Map database category to TypeScript category
export const mapDbToCategory = (dbCategory: any): Category => {
  return {
    id: dbCategory.id,
    name: dbCategory.name,
    description: dbCategory.description || '',
    entity_id: dbCategory.entity_id || dbCategory.entityid,
    entityId: dbCategory.entity_id || dbCategory.entityid,
    projects: [], // This should be populated separately if needed
    created_at: dbCategory.created_at
  };
};

// Map database project to TypeScript project
export const mapDbToProject = (dbProject: any): Project => {
  return {
    id: dbProject.id,
    name: dbProject.name,
    projectNumber: dbProject.project_number,
    description: dbProject.description || '',
    status: dbProject.status || 'concept',
    startDate: dbProject.start_date || dbProject.startDate || new Date().toISOString(),
    start_date: dbProject.start_date || dbProject.startDate,
    endDate: dbProject.end_date || dbProject.endDate,
    end_date: dbProject.end_date || dbProject.endDate,
    categoryId: dbProject.category_id,
    category_id: dbProject.category_id,
    customer: dbProject.customer || '',
    projectManager: dbProject.project_manager || dbProject.projectManager,
    project_manager: dbProject.project_manager || dbProject.projectManager,
    city: dbProject.city || '',
    address: dbProject.address || '',
    buildingPhase: dbProject.building_phase || 'concept',
    building_phase: dbProject.building_phase,
    notes: dbProject.notes || '',
    connectionCount: dbProject.connection_count || 0,
    connection_count: dbProject.connection_count || 0,
    createdAt: dbProject.created_at,
    created_at: dbProject.created_at,
    updatedAt: dbProject.updated_at,
    updated_at: dbProject.updated_at,
    created_by: dbProject.created_by
  };
};

// Map database complex to TypeScript complex
export const mapDbToComplex = (dbComplex: any): Complex => {
  return {
    id: dbComplex.id,
    name: dbComplex.name,
    address: dbComplex.address || '',
    city: dbComplex.city || '',
    postalcode: dbComplex.postal_code || dbComplex.postalcode || '',
    postal_code: dbComplex.postal_code || dbComplex.postalcode,
    description: dbComplex.description || '',
    projectId: dbComplex.project_id,
    project_id: dbComplex.project_id,
    objects: [], // This should be populated separately if needed
    createdAt: dbComplex.created_at,
    created_at: dbComplex.created_at,
    updatedAt: dbComplex.updated_at,
    updated_at: dbComplex.updated_at
  };
};

// Map database object to TypeScript hierarchyObject
export const mapDbToObject = (dbObject: any): HierarchyObject => {
  return {
    id: dbObject.id,
    name: dbObject.name,
    address: dbObject.address || '',
    city: dbObject.city || '',
    postalCode: dbObject.postal_code || dbObject.postalcode || '',
    postal_code: dbObject.postal_code || dbObject.postalcode,
    projectId: dbObject.project_id,
    project_id: dbObject.project_id,
    complexId: dbObject.complex_id || dbObject.complexid,
    complex_id: dbObject.complex_id || dbObject.complexid,
    complexName: dbObject.complex_name,
    objectType: dbObject.object_type || dbObject.objecttype || 'woning',
    object_type: dbObject.object_type || dbObject.objecttype,
    buildPhase: dbObject.build_phase || dbObject.buildphase || 'voorbereiding',
    build_phase: dbObject.build_phase || dbObject.buildphase,
    connectionCount: dbObject.connectionCount || 0,
    connectionStatus: dbObject.connectionStatus || 'none',
    created_at: dbObject.created_at
  };
};

// Map database organization to TypeScript organization (added for completeness)
export const mapDbToOrganization = (dbOrg: any) => {
  return {
    id: dbOrg.id,
    name: dbOrg.name,
    description: dbOrg.description || '',
    address: dbOrg.address || '',
    city: dbOrg.city || '',
    vat_number: dbOrg.vat_number || '',
    owner_name: dbOrg.owner_name || '',
    owner_email: dbOrg.owner_email || '',
    entities: [], // Dit moet apart worden opgevuld indien nodig
    created_at: dbOrg.created_at
  };
};
