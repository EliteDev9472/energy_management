
import { supabase } from '@/integrations/supabase/client';

/**
 * Find project ID based on project name
 */
export const findProjectId = async (projectName?: string): Promise<string | null> => {
  if (!projectName) {
    return null;
  }
  
  try {
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('name', projectName)
      .maybeSingle();
    
    if (projectError) {
      console.error(`Error fetching project ID for ${projectName}:`, projectError);
      return null;
    } else if (projectData) {
      return projectData.id;
    }
  } catch (projectError) {
    console.error(`Error processing project data:`, projectError);
  }
  
  return null;
};
