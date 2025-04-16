
import { supabase } from '@/integrations/supabase/client';
import { Connection } from '@/types/connection';
import { toast } from '@/hooks/use-toast';

export interface HierarchyInfo {
  object?: string;
  complex?: string;
  project?: string;
  category?: string;
  entity?: string;
  organization?: string;
}

/**
 * Create a connection with hierarchy information
 */
export const createConnectionWithHierarchy = async (
  connection: Partial<Connection>, 
  hierarchy: HierarchyInfo
): Promise<Connection | null> => {
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
    if (!hierarchy.object) {
      toast({
        title: "Hiërarchie ontbreekt",
        description: "Een aansluiting moet aan een object gekoppeld zijn",
        variant: "destructive",
      });
      return null;
    }

    // Create connection data for insertion
    const connectionData = {
      type: connection.type,
      status: connection.status,
      address: connection.address,
      city: connection.city,
      postal_code: connection.postalCode,
      capacity: connection.capacity,
      ean: connection.ean,
      supplier: connection.supplier,
      grid_operator: connection.gridOperator,
      metering_company: connection.meteringCompany,
      
      // Hierarchy information
      object_id: hierarchy.object,
      complex_id: hierarchy.complex,
      project_id: hierarchy.project,
      organization: hierarchy.organization,
      entity: hierarchy.entity,
    };

    // Insert the connection into the database
    const { data, error } = await supabase
      .from('connections')
      .insert(connectionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating connection:', error);
      throw error;
    }

    return {
      id: data.id,
      type: data.type,
      status: data.status,
      address: data.address,
      city: data.city,
      postalCode: data.postal_code,
      capacity: data.capacity,
      ean: data.ean,
      supplier: data.supplier,
      gridOperator: data.grid_operator,
      hasFeedback: false,
      organization: data.organization,
      entity: data.entity,
      project: data.project_id,
      object: data.object_id,
      complex: data.complex_id
    };
  } catch (error) {
    console.error('Error in createConnectionWithHierarchy:', error);
    toast({
      title: "Error creating connection",
      description: (error as Error).message || "An unexpected error occurred",
      variant: "destructive",
    });
    return null;
  }
};
