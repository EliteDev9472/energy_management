
import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating projects
 */
export class ProjectValidationService extends BaseValidationService {
  /**
   * Validate if a project belongs to a category
   */
  async validateProjectBelongsToCategory(projectId: string, categoryId: string): Promise<boolean> {
    try {
      console.log(`Validating if project ${projectId} belongs to category ${categoryId}`);
      // First check if the project exists
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id, category_id')
        .eq('id', projectId)
        .single();
      
      if (projectError) {
        console.error(`Error validating project ${projectId}:`, projectError);
        return false;
      }
      
      // Check if the project belongs to the specified category
      return project && project.category_id === categoryId;
    } catch (error) {
      console.error(`Error validating project belongs to category:`, error);
      return false;
    }
  }
  
  /**
   * Get the category ID for a project
   */
  async getProjectCategoryId(projectId: string): Promise<string | null> {
    try {
      console.log(`Getting category ID for project ${projectId}`);
      const { data, error } = await supabase
        .from('projects')
        .select('category_id')
        .eq('id', projectId)
        .single();
      
      if (error) {
        console.error(`Error getting category for project ${projectId}:`, error);
        return null;
      }
      
      if (!data) {
        console.log(`No project found with ID ${projectId}`);
        return null;
      }
      
      if (!data.category_id) {
        console.log(`No category found for project ${projectId}`);
        return null;
      }
      
      console.log(`Found category ${data.category_id} for project ${projectId}`);
      return data.category_id;
    } catch (error) {
      console.error(`Error getting category for project:`, error);
      return null;
    }
  }
  
  /**
   * Validate a project
   */
  async validateProject(project: any): Promise<boolean> {
    try {
      // If project has a categoryId, verify it exists
      if (project.categoryId || project.category_id) {
        const categoryId = project.categoryId || project.category_id;
        const { data, error } = await supabase
          .from('categories')
          .select('id')
          .eq('id', categoryId)
          .single();
        
        if (error) {
          this.showValidationError(`The category does not exist: ${error.message}`);
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating project:', error);
      return false;
    }
  }
}

export const projectValidationService = new ProjectValidationService();
