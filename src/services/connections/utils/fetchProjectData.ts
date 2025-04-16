
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch project and related object data
 */
export const fetchProjectAndObjectData = async (projectId?: string): Promise<{
  projectName: string;
  objectName: string;
}> => {
  let projectName = '';
  let objectName = '';

  if (!projectId) {
    return { projectName, objectName };
  }

  try {
    // Get project data
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('name')
      .eq('id', projectId)
      .maybeSingle();
    
    if (projectError) {
      console.error(`Error fetching project for projectId ${projectId}:`, projectError);
    } else if (projectData) {
      projectName = projectData.name || '';
      
      // Get object data related to this project
      try {
        const { data: objectData, error: objectError } = await supabase
          .from('objects')
          .select('name')
          .eq('project_id', projectId)
          .maybeSingle();
        
        if (objectError) {
          console.error(`Error fetching object for project ${projectId}:`, objectError);
        } else if (objectData && objectData.name) {
          objectName = objectData.name;
        }
      } catch (objError) {
        console.error(`Error processing object data:`, objError);
      }
    }
  } catch (projectError) {
    console.error(`Error processing project data:`, projectError);
  }

  return { projectName, objectName };
};
