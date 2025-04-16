
import { supabase } from '@/integrations/supabase/client';
import { Connection, ConnectionType, ConnectionStatus } from '@/types/connection';
import { fetchEntityAndOrganizationData } from './utils/fetchEntityData';
import { fetchContractDetails } from './utils/fetchContractDetails';
import { fetchProjectAndObjectData } from './utils/fetchProjectData';

/**
 * Get a single connection by ID
 */
export const getConnectionById = async (id: string): Promise<Connection | null> => {
  try {
    // Make sure we select ALL needed fields from the connections table
    const { data, error } = await supabase
      .from('connections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching connection ${id}:`, error);
      return null;
    }

    if (!data) return null;

    // Get contract details
    const contractDetails = await fetchContractDetails(id);

    // Get project, object, entity, and organization data
    const { projectName, objectName } = await fetchProjectAndObjectData(data.project_id);
    const { entityName, organizationName } = await fetchEntityAndOrganizationData();

    // Get technical details if they exist
    const { data: technicalData } = await supabase
      .from('connection_technical_details')
      .select('*')
      .eq('connection_id', id)
      .single();

    // Transform the data to match the Connection type
    return {
      id: data.id,
      ean: data.ean || '',
      address: data.address,
      city: data.city || '',
      postalCode: data.postal_code || '',
      type: data.type as ConnectionType,
      status: data.status as ConnectionStatus,
      supplier: data.supplier || '',
      object: objectName,
      entity: entityName,
      organization: organizationName,
      project: projectName,
      gridOperator: data.grid_operator || '',
      lastModified: data.last_modified || '',
      meteringCompany: data.metering_company || '',
      hasFeedback: false,
      capacity: data.capacity || '',
      gridOperatorWorkNumber: data.grid_operator_work_number || '',
      connectionAddress: data.connection_address || '',
      gridOperatorContact: data.grid_operator_contact || '',
      plannedConnectionDate: data.planned_connection_date || '',
      meteringType: technicalData?.metering_type || '',  // Add this field directly
      technicalSpecifications: technicalData ? {
        voltage: technicalData.voltage || '',
        phases: technicalData.phases || '',
        maxCapacity: technicalData.max_capacity || '',
        connectionFee: technicalData.connection_fee || '',
        meteringType: technicalData.metering_type || ''
      } : {
        meteringType: ''
      },
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
  } catch (error) {
    console.error(`Error in getConnectionById for ${id}:`, error);
    return null;
  }
};
