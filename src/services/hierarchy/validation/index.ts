import { BaseValidationService } from './baseValidationService';
import { ProjectValidationService, projectValidationService } from './projectValidationService';
import { ObjectValidationService, objectValidationService } from './objectValidationService';
import { CategoryValidationService, categoryValidationService } from './categoryValidationService';
import { EntityValidationService, entityValidationService } from './entityValidationService';
import { HierarchyPathService, hierarchyPathService } from './hierarchyPathService';
import { ComplexValidationService, complexValidationService } from './complexValidationService';

// Create the combined hierarchyValidationService for backward compatibility
export class HierarchyValidationService extends BaseValidationService {
  projectValidation: ProjectValidationService;
  objectValidation: ObjectValidationService;
  categoryValidation: CategoryValidationService;
  entityValidation: EntityValidationService;
  complexValidation: ComplexValidationService;
  hierarchyPath: HierarchyPathService;
  
  constructor() {
    super();
    this.projectValidation = projectValidationService;
    this.objectValidation = objectValidationService;
    this.categoryValidation = categoryValidationService;
    this.entityValidation = entityValidationService;
    this.complexValidation = complexValidationService;
    this.hierarchyPath = hierarchyPathService;
  }
  
  // Proxy methods for backward compatibility
  validateProjectBelongsToCategory(projectId: string, categoryId: string): Promise<boolean> {
    return this.projectValidation.validateProjectBelongsToCategory(projectId, categoryId);
  }
  
  getProjectCategoryId(projectId: string): Promise<string | null> {
    return this.projectValidation.getProjectCategoryId(projectId);
  }
  
  validateObjectBelongsToComplex(objectId: string, complexId: string): Promise<boolean> {
    return this.hierarchyPath.validateObjectBelongsToComplex(objectId, complexId);
  }

  validateComplexBelongsToProject(complexId: string, projectId: string): Promise<boolean> {
    return this.hierarchyPath.validateComplexBelongsToProject(complexId, projectId);
  }
  
  // Keep for backward compatibility
  validateObjectBelongsToProject(objectId: string, projectId: string): Promise<boolean> {
    return this.objectValidation.validateObjectBelongsToProject(objectId, projectId);
  }
  
  validateCategoryBelongsToEntity(categoryId: string, entityId: string): Promise<boolean> {
    return this.categoryValidation.validateCategoryBelongsToEntity(categoryId, entityId);
  }
  
  validateEntityBelongsToOrganization(entityId: string, organizationId: string): Promise<boolean> {
    return this.entityValidation.validateEntityBelongsToOrganization(entityId, entityId);
  }
  
  getHierarchyPath(id: string, type: 'object' | 'complex' | 'project' | 'category' | 'entity'): Promise<any> {
    return this.hierarchyPath.getHierarchyPath(id, type);
  }
  
  validateFullHierarchy(hierarchy: { 
    objectId?: string, 
    complexId?: string,
    projectId?: string, 
    categoryId?: string, 
    entityId?: string, 
    organizationId?: string 
  }, type: 'connection' | 'meter' | 'document'): Promise<boolean> {
    return this.hierarchyPath.validateFullHierarchy(hierarchy, type);
  }
  
  validateProject(project: any): Promise<boolean> {
    return this.projectValidation.validateProject(project);
  }
}

// Create and export an instance for convenience
export const hierarchyValidationService = new HierarchyValidationService();

// Export individual services for direct use
export {
  projectValidationService,
  objectValidationService,
  categoryValidationService,
  entityValidationService,
  complexValidationService,
  hierarchyPathService
};
