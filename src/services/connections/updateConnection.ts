
import { supabase } from '@/integrations/supabase/client';
import { Connection } from '@/types/connection';
import { getConnectionById } from './getConnectionById';
import { findProjectId } from './utils/findProjectId';
import { toast } from '@/hooks/use-toast';
import { hierarchyValidationService } from '@/services/hierarchy/hierarchyValidationService';

/**
 * Update a connection
 */
export const updateConnection = async (connection: Connection): Promise<Connection | null> => {
  try {
    // Validate required fields
    if (!connection.address || !connection.type || !connection.status) {
      toast({
        title: "Ontbrekende velden",
        description: "Adres, type en status zijn verplichte velden",
        variant: "destructive",
      });
      return null;
    }

    // Validate hierarchy information is present
    if (!connection.object) {
      toast({
        title: "Hiërarchie ontbreekt",
        description: "Een aansluiting moet aan een object gekoppeld zijn",
        variant: "destructive",
      });
      return null;
    }
    
    // Validate the hierarchy is valid
    const isValid = await hierarchyValidationService.validateFullHierarchy(
      { objectId: connection.object },
      'connection'
    );
    
    if (!isValid) {
      toast({
        title: "Ongeldige hiërarchie",
        description: "De geselecteerde hiërarchie is ongeldig",
        variant: "destructive",
      });
      return null;
    }

    // Get the project ID based on the project name
    const projectId = connection.project ? await findProjectId(connection.project) : null;

    // Normalize connection type to ensure consistency
    const normalizedType = normalizeConnectionType(connection.type);

    // Update the connection with the proper project ID and all required fields
    const { data, error } = await supabase
      .from('connections')
      .update({
        address: connection.address,
        city: connection.city,
        postal_code: connection.postalCode,
        type: normalizedType,
        status: connection.status,
        supplier: connection.supplier,
        grid_operator: connection.gridOperator,
        ean: connection.ean,
        metering_company: connection.meteringCompany,
        project_id: projectId,
        organization: connection.organization,
        entity: connection.entity,
        complex: connection.complex,
        object: connection.object,
        capacity: connection.capacity,
        grid_operator_work_number: connection.gridOperatorWorkNumber,
        grid_operator_contact: connection.gridOperatorContact,
        connection_address: connection.connectionAddress,
        planned_connection_date: connection.plannedConnectionDate,
        last_modified: new Date().toISOString()
      })
      .eq('id', connection.id)
      .select();

    if (error) {
      console.error('Error updating connection:', error);
      toast({
        title: "Fout bij bijwerken",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Update technical details if they exist
    if (connection.technicalSpecifications) {
      try {
        // Check if technical details already exist
        const { data: existingTechDetails } = await supabase
          .from('connection_technical_details')
          .select('*')
          .eq('connection_id', connection.id)
          .single();

        // Prepare technical details for upsert
        const techDetails = {
          connection_id: connection.id,
          metering_type: connection.technicalSpecifications.meteringType || '',
          voltage: connection.technicalSpecifications.voltage || '',
          phases: connection.technicalSpecifications.phases || '',
          max_capacity: connection.technicalSpecifications.maxCapacity || '',
          connection_fee: connection.technicalSpecifications.connectionFee || ''
        };

        // Using upsert to create or update
        const { error: techError } = await supabase
          .from('connection_technical_details')
          .upsert(techDetails);

        if (techError) {
          console.error('Error updating technical details:', techError);
        }
      } catch (techError) {
        console.error(`Error processing technical update:`, techError);
      }
    }

    // Return the updated connection
    return await getConnectionById(connection.id);
  } catch (error) {
    console.error('Error in updateConnection:', error);
    toast({
      title: "Fout bij bijwerken",
      description: (error as Error).message,
      variant: "destructive",
    });
    return null;
  }
};

// Helper to normalize connection type for consistency
function normalizeConnectionType(type: any): string {
  if (!type) return 'Elektriciteit'; // Default value
  
  // Handle English vs Dutch differences
  if (typeof type === 'string') {
    const lowerType = type.toLowerCase();
    
    if (lowerType === 'electricity' || lowerType === 'elektriciteit') {
      return 'Elektriciteit';
    } else if (lowerType === 'gas') {
      return 'Gas';
    } else if (lowerType === 'water') {
      return 'Water';
    } else if (lowerType === 'heat' || lowerType === 'warmte') {
      return 'Warmte';
    }
  }
  
  // Return original if it doesn't match any known type
  return type;
}
