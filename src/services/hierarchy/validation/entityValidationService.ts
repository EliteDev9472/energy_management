
import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating entities
 */
export class EntityValidationService extends BaseValidationService {
  /**
   * Validate if an entity belongs to an organization
   */
  async validateEntityBelongsToOrganization(entityId: string, organizationId: string): Promise<boolean> {
    try {
      console.log(`Validating if entity ${entityId} belongs to organization ${organizationId}`);
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
    } catch (error) {
      console.error(`Error validating entity belongs to organization:`, error);
      return false;
    }
  }
}

export const entityValidationService = new EntityValidationService();
