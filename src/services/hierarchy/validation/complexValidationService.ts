
import { supabase } from '@/integrations/supabase/client';
import { BaseValidationService } from './baseValidationService';

/**
 * Service for validating complexes
 */
export class ComplexValidationService extends BaseValidationService {
  /**
   * Validate that a complex belongs to a project
   */
  async validateComplexBelongsToProject(complexId: string, projectId: string): Promise<boolean> {
    try {
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
    } catch (error) {
      console.error('Error in validateComplexBelongsToProject:', error);
      return false;
    }
  }
  
  /**
   * Get the project ID for a complex
   */
  async getComplexProjectId(complexId: string): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('complexes')
        .select('project_id')
        .eq('id', complexId)
        .single();
      
      if (error) {
        console.error(`Error getting project ID for complex ${complexId}:`, error);
        return null;
      }
      
      return data?.project_id || null;
    } catch (error) {
      console.error('Error in getComplexProjectId:', error);
      return null;
    }
  }
  
  /**
   * Validate that a complex exists
   */
  async validateComplex(complex: string | any): Promise<boolean> {
    try {
      const complexId = typeof complex === 'string' ? complex : complex?.id;
      
      if (!complexId) {
        return false;
      }
      
      const { data, error } = await supabase
        .from('complexes')
        .select('id')
        .eq('id', complexId)
        .single();
      
      if (error) {
        console.error(`Error validating complex ${complexId}:`, error);
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Error in validateComplex:', error);
      return false;
    }
  }
}

export const complexValidationService = new ComplexValidationService();
