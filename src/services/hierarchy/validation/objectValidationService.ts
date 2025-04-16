
import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating objects
 */
export class ObjectValidationService extends BaseValidationService {
  /**
   * Validate if an object belongs to a project
   */
  async validateObjectBelongsToProject(objectId: string, projectId: string): Promise<boolean> {
    try {
      console.log(`Validating if object ${objectId} belongs to project ${projectId}`);
      const { data, error } = await supabase
        .from('objects')
        .select('project_id')
        .eq('id', objectId)
        .single();
      
      if (error) {
        console.error(`Error validating object ${objectId}:`, error);
        return false;
      }
      
      return data && data.project_id === projectId;
    } catch (error) {
      console.error(`Error validating object belongs to project:`, error);
      return false;
    }
  }
}

export const objectValidationService = new ObjectValidationService();
