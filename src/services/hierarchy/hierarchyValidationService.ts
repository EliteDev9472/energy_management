
import { HierarchyValidationService } from '@/types/hierarchy';
import { hierarchyValidationService as validationService } from './validation';

// Extend the validation service with our custom validation logic for hierarchical connections
export const hierarchyValidationService: HierarchyValidationService = {
  /**
   * Validates that a complete hierarchy path exists and is valid
   * An item can only exist if its parent exists
   */
  validateFullHierarchy: async (itemInfo: { 
    objectId?: string;
    projectId?: string;
    categoryId?: string;
    entityId?: string;
    organizationId?: string;
  }, itemType: 'connection' | 'meter' | 'document'): Promise<boolean> => {
    try {
      // If we have an object ID, validate the complete path up to the organization
      if (itemInfo.objectId) {
        const path = await validationService.getHierarchyPath(itemInfo.objectId, 'object');
        
        if (!path || !path.objectId || !path.projectId || !path.categoryId || 
            !path.entityId || !path.organizationId) {
          console.error(`Invalid hierarchy path for ${itemType}:`, path);
          return false;
        }
        
        return true;
      }
      
      // If we have a project ID, validate the path up to the organization
      if (itemInfo.projectId) {
        const path = await validationService.getHierarchyPath(itemInfo.projectId, 'project');
        
        if (!path || !path.projectId || !path.categoryId || 
            !path.entityId || !path.organizationId) {
          console.error(`Invalid hierarchy path for ${itemType}, missing project path:`, path);
          return false;
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error(`Error validating hierarchy for ${itemType}:`, error);
      return false;
    }
  },
  
  /**
   * Gets the complete hierarchy path for a specific item
   */
  getHierarchyPath: async (id: string, type: "object" | "project" | "category" | "entity"): Promise<any> => {
    return validationService.getHierarchyPath(id, type);
  },
  
  /**
   * Validates that a project belongs to a specific category
   */
  validateProjectBelongsToCategory: async (projectId: string, categoryId: string): Promise<boolean> => {
    try {
      const path = await validationService.getHierarchyPath(projectId, 'project');
      return !!path && path.categoryId === categoryId;
    } catch (error) {
      console.error('Error validating project belongs to category:', error);
      return false;
    }
  },
  
  /**
   * Gets the category ID for a specific project
   */
  getProjectCategoryId: async (projectId: string): Promise<string | null> => {
    try {
      const path = await validationService.getHierarchyPath(projectId, 'project');
      return path ? path.categoryId : null;
    } catch (error) {
      console.error('Error getting project category ID:', error);
      return null;
    }
  },
  
  /**
   * Validates that an object belongs to a specific project
   */
  validateObjectBelongsToProject: async (objectId: string, projectId: string): Promise<boolean> => {
    try {
      const path = await validationService.getHierarchyPath(objectId, 'object');
      return !!path && path.projectId === projectId;
    } catch (error) {
      console.error('Error validating object belongs to project:', error);
      return false;
    }
  },
  
  /**
   * Validates that a category belongs to a specific entity
   */
  validateCategoryBelongsToEntity: async (categoryId: string, entityId: string): Promise<boolean> => {
    try {
      const path = await validationService.getHierarchyPath(categoryId, 'category');
      return !!path && path.entityId === entityId;
    } catch (error) {
      console.error('Error validating category belongs to entity:', error);
      return false;
    }
  },
  
  /**
   * Validates that an entity belongs to a specific organization
   */
  validateEntityBelongsToOrganization: async (entityId: string, organizationId: string): Promise<boolean> => {
    try {
      const path = await validationService.getHierarchyPath(entityId, 'entity');
      return !!path && path.organizationId === organizationId;
    } catch (error) {
      console.error('Error validating entity belongs to organization:', error);
      return false;
    }
  },
  
  /**
   * Validates that a project is valid in the hierarchy
   */
  validateProject: async (project: string | any): Promise<boolean> => {
    try {
      const projectId = typeof project === 'string' ? project : project.id;
      if (!projectId) return false;
      
      const path = await validationService.getHierarchyPath(projectId, 'project');
      return !!path && !!path.projectId && !!path.categoryId && !!path.entityId && !!path.organizationId;
    } catch (error) {
      console.error('Error validating project:', error);
      return false;
    }
  }
};

export type { HierarchyValidationService };
