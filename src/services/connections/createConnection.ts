
import { supabase } from '@/integrations/supabase/client';
import { Connection } from '@/types/connection';
import { findProjectId } from './utils/findProjectId';
import { toast } from '@/hooks/use-toast';
import { hierarchyValidationService } from '@/services/hierarchy/hierarchyValidationService';

/**
 * Create a new connection
 */
export const createConnection = async (connection: Partial<Connection>): Promise<Connection | null> => {
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

    // Validate EAN code is present and not empty
    if (!connection.ean || connection.ean.trim() === '') {
      toast({
        title: "EAN code ontbreekt",
        description: "Een EAN code is verplicht voor aansluitingen",
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

    // Get the project ID based on the project name if provided
    let projectId = null;
    if (connection.project) {
      projectId = await findProjectId(connection.project);
    }

    // Normalize connection type to ensure consistency
    const normalizedType = normalizeConnectionType(connection.type);

    // Create the connection with the proper project ID
    const { data, error } = await supabase
      .from('connections')
      .insert({
        address: connection.address,
        city: connection.city || '',
        postal_code: connection.postalCode || '',
        type: normalizedType,
        status: connection.status,
        supplier: connection.supplier || '',
        grid_operator: connection.gridOperator || '',
        ean: connection.ean || '',
        metering_company: connection.meteringCompany || '',
        entity: connection.entity || '',
        organization: connection.organization || '',
        object: connection.object || '',
        project_id: projectId,
        created_by: null, 
        created_at: new Date().toISOString(),
        last_modified: new Date().toISOString(),
        request_date: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating connection:', error);
      toast({
        title: "Fout bij aanmaken",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    // Add technical details if they exist (particularly meteringType)
    if (connection.technicalSpecifications) {
      try {
        const { error: techError } = await supabase
          .from('connection_technical_details')
          .insert({
            connection_id: data.id,
            metering_type: connection.technicalSpecifications.meteringType || null
          });

        if (techError) {
          console.error('Error adding technical details:', techError);
        }
      } catch (techError) {
        console.error('Error processing technical insertion:', techError);
      }
    } else if (connection.meteringType) {
      // If meteringType is provided directly (from form)
      try {
        const { error: techError } = await supabase
          .from('connection_technical_details')
          .insert({
            connection_id: data.id,
            metering_type: connection.meteringType
          });

        if (techError) {
          console.error('Error adding technical details:', techError);
        }
      } catch (techError) {
        console.error('Error processing technical insertion:', techError);
      }
    }

    // Add contract details if they exist
    if (connection.contract && Object.keys(connection.contract).length > 0) {
      try {
        const { error: contractError } = await supabase
          .from('connection_contract_details')
          .insert({
            connection_id: data.id,
            end_date: connection.contract.endDate || null,
            price: connection.contract.price || null,
            type: connection.contract.type || null,
            start_date: connection.contract.startDate || null,
            conditions: connection.contract.conditions || null
          });

        if (contractError) {
          console.error('Error adding contract details:', contractError);
        }
      } catch (contractError) {
        console.error('Error processing contract insertion:', contractError);
      }
    }

    return mapConnectionData(data);
  } catch (error) {
    console.error('Error in createConnection:', error);
    toast({
      title: "Fout bij aanmaken",
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

// Helper function to map database response to Connection type
function mapConnectionData(data: any): Connection {
  return {
    id: data.id,
    address: data.address,
    city: data.city || '',
    postalCode: data.postal_code || '',
    type: data.type,
    status: data.status,
    supplier: data.supplier || '',
    entity: data.entity || '',
    organization: data.organization || '',
    project: data.project || '',
    object: data.object || '', 
    gridOperator: data.grid_operator || '',
    ean: data.ean || '',
    lastModified: data.last_modified,
    meteringCompany: data.metering_company || '',
    technicalSpecifications: {
      meteringType: data.metering_type || ''
    },
    contract: {
      endDate: '',
      price: '',
      startDate: '',
      type: '',
      conditions: ''
    }
  };
}
