
import { supabase } from '@/integrations/supabase/client';

/**
 * Services for organization deletion management
 */
export const organizationDeletionService = {
  /**
   * Mark organization for deletion
   */
  markForDeletion: async (id: string, scheduledTime: Date): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          pending_deletion: true,
          scheduled_deletion_time: scheduledTime.toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error marking organization for deletion:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in markForDeletion:', error);
      return false;
    }
  },
  
  /**
   * Cancel deletion of organization
   */
  cancelDeletion: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({
          pending_deletion: false,
          scheduled_deletion_time: null
        })
        .eq('id', id);
      
      if (error) {
        console.error('Error canceling organization deletion:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in cancelDeletion:', error);
      return false;
    }
  },

  /**
   * Permanently delete organization
   * This would typically be called by a background job after the 24h period
   */
  deleteOrganization: async (id: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('organizations')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting organization:', error);
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error('Error in deleteOrganization:', error);
      return false;
    }
  }
};
