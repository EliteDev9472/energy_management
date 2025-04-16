
import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating categories
 */
export class CategoryValidationService extends BaseValidationService {
  /**
   * Validate if a category belongs to an entity
   */
  async validateCategoryBelongsToEntity(categoryId: string, entityId: string): Promise<boolean> {
    try {
      console.log(`Validating if category ${categoryId} belongs to entity ${entityId}`);
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
    } catch (error) {
      console.error(`Error validating category belongs to entity:`, error);
      return false;
    }
  }
}

export const categoryValidationService = new CategoryValidationService();
