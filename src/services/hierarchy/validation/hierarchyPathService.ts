import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating and getting hierarchy paths
 */
export class HierarchyPathService extends BaseValidationService {
  /**
   * Get the complete hierarchy path for an item
   */
  async getHierarchyPath(id: string, type: 'object' | 'complex' | 'project' | 'category' | 'entity'): Promise<any> {
    try {
      console.log(`Getting hierarchy path for ${type} ${id}`);
      let objectId, complexId, projectId, categoryId, entityId, organizationId;
      
      switch (type) {
        case 'object':
          objectId = id;
          // Get complex for the object
          const { data: objectData, error: objectError } = await supabase
            .from('objects')
            .select('complex_id, complex_name')
            .eq('id', objectId)
            .single();
          
          if (objectError || !objectData) {
            console.error(`Error getting complex for object ${objectId}:`, objectError);
            return null;
          }
          
          complexId = objectData.complex_id;
          // Continue to get complex data
          
        case 'complex':
          if (!complexId) complexId = id;
          // Get project for the complex
          const { data: complexData, error: complexError } = await supabase
            .from('complexes')
            .select('project_id, name')
            .eq('id', complexId)
            .single();
          
          if (complexError || !complexData) {
            console.error(`Error getting project for complex ${complexId}:`, complexError);
            return null;
          }
          
          projectId = complexData.project_id;
          // Continue to get project data
          
        case 'project':
          if (!projectId) projectId = id;
          // Get category for the project
          const { data: projectData, error: projectError } = await supabase
            .from('projects')
            .select('category_id, name')
            .eq('id', projectId)
            .single();
          
          if (projectError || !projectData) {
            console.error(`Error getting category for project ${projectId}:`, projectError);
            return null;
          }
          
          categoryId = projectData.category_id;
          // Continue to get category data
          
        case 'category':
          if (!categoryId) categoryId = id;
          // Get entity for the category
          const { data: categoryData, error: categoryError } = await supabase
            .from('categories')
            .select('entity_id, name')
            .eq('id', categoryId)
            .single();
          
          if (categoryError || !categoryData) {
            console.error(`Error getting entity for category ${categoryId}:`, categoryError);
            return null;
          }
          
          entityId = categoryData.entity_id;
          // Continue to get entity data
          
        case 'entity':
          if (!entityId) entityId = id;
          // Get organization for the entity
          const { data: entityData, error: entityError } = await supabase
            .from('entities')
            .select('organization_id, name')
            .eq('id', entityId)
            .single();
          
          if (entityError || !entityData) {
            console.error(`Error getting organization for entity ${entityId}:`, entityError);
            return null;
          }
          
          organizationId = entityData.organization_id;

          // Get organization name
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', organizationId)
            .single();
            
          if (orgError) {
            console.error(`Error getting organization name for ${organizationId}:`, orgError);
          }
          
          break;
          
        default:
          return null;
      }
      
      // Now that we have all IDs, let's get the names if needed
      let objectName, complexName, projectName, categoryName, entityName, organizationName;
      
      if (objectId && !type.startsWith('object')) {
        const { data: objData } = await supabase
          .from('objects')
          .select('name')
          .eq('id', objectId)
          .single();
        objectName = objData?.name;
      }
      
      if (complexId && !type.startsWith('complex')) {
        const { data: cplxData } = await supabase
          .from('complexes')
          .select('name')
          .eq('id', complexId)
          .single();
        complexName = cplxData?.name;
      }
      
      if (projectId && !type.startsWith('project')) {
        const { data: projData } = await supabase
          .from('projects')
          .select('name')
          .eq('id', projectId)
          .single();
        projectName = projData?.name;
      }
      
      if (categoryId && !type.startsWith('category')) {
        const { data: catData } = await supabase
          .from('categories')
          .select('name')
          .eq('id', categoryId)
          .single();
        categoryName = catData?.name;
      }
      
      if (entityId && !type.startsWith('entity')) {
        const { data: entData } = await supabase
          .from('entities')
          .select('name')
          .eq('id', entityId)
          .single();
        entityName = entData?.name;
      }
      
      if (organizationId) {
        const { data: orgData } = await supabase
          .from('organizations')
          .select('name')
          .eq('id', organizationId)
          .single();
        organizationName = orgData?.name;
      }
      
      return {
        objectId,
        objectName: objectName || (type === 'object' ? null : undefined),
        complexId,
        complexName: complexName || (type === 'complex' ? complexData?.name : undefined),
        projectId,
        projectName: projectName || (type === 'project' ? projectData?.name : undefined),
        categoryId,
        categoryName: categoryName || (type === 'category' ? categoryData?.name : undefined),
        entityId,
        entityName: entityName || (type === 'entity' ? entityData?.name : undefined),
        organizationId,
        organizationName
      };
    } catch (error) {
      console.error('Error getting hierarchy path:', error);
      return null;
    }
  }
  
  /**
   * Validate the full hierarchy chain
   */
  async validateFullHierarchy(hierarchy: { 
    objectId?: string, 
    complexId?: string,
    projectId?: string, 
    categoryId?: string, 
    entityId?: string, 
    organizationId?: string 
  }, type: 'connection' | 'meter' | 'document'): Promise<boolean> {
    try {
      // Start validation from the lowest level that exists
      if (hierarchy.objectId && hierarchy.complexId) {
        const isObjectValid = await this.validateObjectBelongsToComplex(
          hierarchy.objectId,
          hierarchy.complexId
        );
        
        if (!isObjectValid) {
          console.error('Object does not belong to specified complex');
          return false;
        }
      }
      
      if (hierarchy.complexId && hierarchy.projectId) {
        const isComplexValid = await this.validateComplexBelongsToProject(
          hierarchy.complexId,
          hierarchy.projectId
        );
        
        if (!isComplexValid) {
          console.error('Complex does not belong to specified project');
          return false;
        }
      }
      
      if (hierarchy.projectId && hierarchy.categoryId) {
        const isProjectValid = await this.validateProjectBelongsToCategory(
          hierarchy.projectId,
          hierarchy.categoryId
        );
        
        if (!isProjectValid) {
          console.error('Project does not belong to specified category');
          return false;
        }
      }
      
      if (hierarchy.categoryId && hierarchy.entityId) {
        const isCategoryValid = await this.validateCategoryBelongsToEntity(
          hierarchy.categoryId,
          hierarchy.entityId
        );
        
        if (!isCategoryValid) {
          console.error('Category does not belong to specified entity');
          return false;
        }
      }
      
      if (hierarchy.entityId && hierarchy.organizationId) {
        const isEntityValid = await this.validateEntityBelongsToOrganization(
          hierarchy.entityId,
          hierarchy.organizationId
        );
        
        if (!isEntityValid) {
          console.error('Entity does not belong to specified organization');
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating full hierarchy:', error);
      return false;
    }
  }
  
  // Add new validation method for object-complex relationship
  async validateObjectBelongsToComplex(objectId: string, complexId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('objects')
      .select('complex_id')
      .eq('id', objectId)
      .single();
    
    if (error) {
      console.error(`Error validating object ${objectId}:`, error);
      return false;
    }
    
    return data && data.complex_id === complexId;
  }
  
  // Add new validation method for complex-project relationship
  async validateComplexBelongsToProject(complexId: string, projectId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('complexes')
      .select('project_id')
      .eq('id', complexId)
      .single();
    
    if (error) {
      console.error(`Error validating complex ${complexId}:`, error);
      return false;
    }
    
    return data && data.project_id === projectId;
  }
  
  // Keep these methods for other validations
  private async validateProjectBelongsToCategory(projectId: string, categoryId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('projects')
      .select('category_id')
      .eq('id', projectId)
      .single();
    
    if (error) {
      console.error(`Error validating project ${projectId}:`, error);
      return false;
    }
    
    return data && data.category_id === categoryId;
  }
  
  private async validateCategoryBelongsToEntity(categoryId: string, entityId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('categories')
      .select('entity_id')
      .eq('id', categoryId)
      .single();
    
    if (error) {
      console.error(`Error validating category ${categoryId}:`, error);
      return false;
    }
    
    return data && data.entity_id === entityId;
  }
  
  private async validateEntityBelongsToOrganization(entityId: string, organizationId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('entities')
      .select('organization_id')
      .eq('id', entityId)
      .single();
    
    if (error) {
      console.error(`Error validating entity ${entityId}:`, error);
      return false;
    }
    
    return data && data.organization_id === organizationId;
  }
}

export const hierarchyPathService = new HierarchyPathService();
