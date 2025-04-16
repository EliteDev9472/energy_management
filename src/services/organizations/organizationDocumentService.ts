
import { supabase } from '@/integrations/supabase/client';

/**
 * Services for organization documents (mandates, etc.)
 */
export const organizationDocumentService = {
  /**
   * Upload mandate document for organization
   */
  uploadMandate: async (id: string, file: File): Promise<boolean> => {
    try {
      // First, upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${id}_mandate_${Date.now()}.${fileExt}`;
      const filePath = `mandates/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('mandates')
        .upload(filePath, file);
      
      if (uploadError) {
        console.error('Error uploading mandate file:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL for the file
      const { data: urlData } = supabase
        .storage
        .from('mandates')
        .getPublicUrl(filePath);
      
      // Update the organization with the mandate file path
      const { error: updateError } = await supabase
        .from('organizations')
        .update({
          mandate_file_path: urlData.publicUrl,
          has_mandate: true
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Error updating organization with mandate file:', updateError);
        throw updateError;
      }
      
      return true;
    } catch (error) {
      console.error('Error in uploadMandate:', error);
      return false;
    }
  }
};
