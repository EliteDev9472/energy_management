
import { supabase } from '@/integrations/supabase/client';

/**
 * Fetch entity and organization data
 */
export const fetchEntityAndOrganizationData = async (): Promise<{
  entityName: string;
  organizationName: string;
}> => {
  let entityName = '';
  let organizationName = '';

  try {
    const { data: entityData, error: entityError } = await supabase
      .from('entities')
      .select('name, organization_id')
      .limit(1)
      .maybeSingle();
    
    if (entityError) {
      console.error(`Error fetching entity data:`, entityError);
    } else if (entityData) {
      entityName = entityData.name || '';
      
      // Get organization data
      if (entityData.organization_id) {
        try {
          const { data: orgData, error: orgError } = await supabase
            .from('organizations')
            .select('name')
            .eq('id', entityData.organization_id)
            .maybeSingle();
          
          if (orgError) {
            console.error(`Error fetching organization data:`, orgError);
          } else if (orgData && orgData.name) {
            organizationName = orgData.name;
          }
        } catch (orgError) {
          console.error(`Error processing organization data:`, orgError);
        }
      }
    }
  } catch (entityError) {
    console.error(`Error processing entity data:`, entityError);
  }

  return { entityName, organizationName };
};
