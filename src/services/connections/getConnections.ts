
import { supabase } from '@/integrations/supabase/client';
import { Connection, ConnectionType, ConnectionStatus } from '@/types/connection';
import { fetchEntityAndOrganizationData } from './utils/fetchEntityData';
import { fetchContractDetails } from './utils/fetchContractDetails';
import { fetchProjectAndObjectData } from './utils/fetchProjectData';

/**
 * Get all connections from the database
 */
export const getConnections = async (): Promise<Connection[]> => {
  try {
    // First, get the basic connection data
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .order('last_modified', { ascending: false });

    if (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }

    // Transform the data to match the Connection type
    const connections = await Promise.all((data || []).map(async (conn) => {
      // Get project, object, entity and organization data
      const { projectName, objectName } = await fetchProjectAndObjectData(conn.project_id);
      const { entityName, organizationName } = await fetchEntityAndOrganizationData();
      
      // Get contract details
      const contractDetails = await fetchContractDetails(conn.id);

      // Transform the data to match the Connection type
      return {
        id: conn.id,
        ean: conn.ean || '',
        address: conn.address,
        city: conn.city || '',
        postalCode: conn.postal_code || '',
        type: conn.type as ConnectionType,
        status: conn.status as ConnectionStatus,
        supplier: conn.supplier || '',
        object: objectName,
        entity: entityName,
        organization: organizationName,
        project: projectName,
        gridOperator: conn.grid_operator || '',
        lastModified: conn.last_modified || '',
        meteringCompany: conn.metering_company || '',
        hasFeedback: false,
        capacity: conn.capacity || '',
        gridOperatorWorkNumber: conn.grid_operator_work_number || '',
        connectionAddress: conn.connection_address || '',
        gridOperatorContact: conn.grid_operator_contact || '',
        plannedConnectionDate: conn.planned_connection_date || '',
        contract: contractDetails ? {
          endDate: contractDetails.end_date || '',
          price: contractDetails.price || '',
          type: contractDetails.type || '',
          startDate: contractDetails.start_date || '',
          conditions: contractDetails.conditions || ''
        } : {
          endDate: '',
          price: '',
          type: '',
          startDate: '',
          conditions: ''
        },
      };
    }));

    return connections;
  } catch (error) {
    console.error('Error in getConnections:', error);
    return [];
  }
};
