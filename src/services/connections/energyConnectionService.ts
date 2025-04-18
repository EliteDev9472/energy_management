import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { EnergyConnection } from "@/types/connection/energy-connection";
import { ConnectionRequestStatus } from "@/types/connection/pipeline";

// Helper function to map DB format to app format
const mapToEnergyConnection = (dbConnection: any): EnergyConnection => {
  return {
    id: dbConnection.id,
    address: dbConnection.address,
    city: dbConnection.city,
    postalCode: dbConnection.postal_code,
    type: dbConnection.type,
    status: dbConnection.status,
    requestStatus: dbConnection.status as ConnectionRequestStatus,
    capacity: dbConnection.capacity,
    gridOperator: dbConnection.grid_operator,
    projectId: dbConnection.project_id,
    complexId: dbConnection.complex_id,
    objectId: dbConnection.object_id,
    objectName: dbConnection.object_name || '',
    requestDate: dbConnection.request_date,
    desiredConnectionDate: dbConnection.desired_connection_date,
    ean: dbConnection.ean || '',
    plannedConnectionDate: dbConnection.planned_connection_date,
    gridOperatorWorkNumber: dbConnection.grid_operator_work_number,
    inProgressDate: dbConnection.in_progress_date,
    activationDate: dbConnection.activation_date,
    isActiveSubscription: dbConnection.is_active_subscription || false,
    installer: dbConnection.installer,
    meteringType: dbConnection.metering_type,
    hasFeedback: false, // This would need to be determined from a separate query
    meterRole: dbConnection.meter_role as 'main' | 'submeter' | 'mloea' || 'main'
  };
};

// Helper function to map app format to DB format
const mapToDbConnection = (connection: Partial<EnergyConnection>) => {
  return {
    address: connection.address,
    city: connection.city,
    postal_code: connection.postalCode,
    type: connection.type,
    status: connection.status,
    capacity: connection.capacity,
    grid_operator: connection.gridOperator,
    project_id: connection.projectId,
    complex_id: connection.complexId,
    object_id: connection.objectId,
    object_name: connection.objectName,
    request_date: connection.requestDate,
    desired_connection_date: connection.desiredConnectionDate,
    ean: connection.ean,
    planned_connection_date: connection.plannedConnectionDate,
    grid_operator_work_number: connection.gridOperatorWorkNumber,
    meter_role: connection.meterRole,
    // metering_type: connection.meteringType
  };
};

function mapEnergyConnectionFromDB(data: any): EnergyConnection {
  let installer;

  if (data.installer) {
    try {
      installer = typeof data.installer === 'string'
        ? JSON.parse(data.installer)
        : data.installer;
    } catch (e) {
      console.error('Error parsing installer data:', e, data.installer);
      installer = undefined;
    }
  }

  let meteringType = data.metering_type;

  // Safely parse strings to prevent errors with undefined/malformed data
  return {
    id: data.id,
    address: data.address || '',
    city: data.city || '',
    postalCode: data.postal_code || '',
    type: data.type || '',
    status: data.status || '',
    requestStatus: data.status as ConnectionRequestStatus,
    capacity: data.capacity || '',
    gridOperator: data.grid_operator || '',
    projectId: data.project_id || null,
    complexId: data.complex_id || null,
    objectId: data.object_id || null,
    objectName: data.object_name || '',
    requestDate: data.request_date || null,
    desiredConnectionDate: data.desired_connection_date || null,
    ean: data.ean || null,
    plannedConnectionDate: data.planned_connection_date || null,
    gridOperatorWorkNumber: data.grid_operator_work_number || null,
    inProgressDate: data.in_progress_date || null,
    activationDate: data.activation_date || null,
    isActiveSubscription: Boolean(data.is_active_subscription),
    installer: installer,
    meteringType: meteringType,
    hasFeedback: false,
    meterRole: (data.meter_role as 'main' | 'submeter' | 'mloea') || 'main'
  };
}


export const energyConnectionService = {
  // Get all energy connections
  async getEnergyConnections() {
    const { data, error } = await supabase
      .from('energy_connections')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching energy connections:', error);
      throw error;
    }

    return data?.map(mapToEnergyConnection) || [];
  },

  // Get energy connection by ID
  async getEnergyConnectionById(id: string) {
    const { data, error } = await supabase
      .from('energy_connections')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching energy connection ${id}:`, error);
      throw error;
    }

    return mapToEnergyConnection(data);
  },

  // Get energy connections by project ID
  async getEnergyConnectionsByProjectId(projectId: string) {
    const { data, error } = await supabase
      .from('energy_connections')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching energy connections by project ID:', error);
      throw error;
    }

    return data?.map(mapToEnergyConnection) || [];
  },

  // Get energy connections by complex ID
  async getEnergyConnectionsByComplexId(complexId: string) {
    console.log('Fetching connections for complex ID:', complexId);
    const { data, error } = await supabase
      .from('energy_connections')
      .select('*')
      .eq('complex_id', complexId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching energy connections by complex ID:', error);
      throw error;
    }

    console.log('Found connections:', data);
    return data?.map(mapToEnergyConnection) || [];
  },

  // Get energy connections by object ID
  async getEnergyConnectionsByObjectId(objectId: string) {
    console.log('Fetching connections for object ID:', objectId);
    const { data, error } = await supabase
      .from('energy_connections')
      .select('*')
      .eq('object_id', objectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching energy connections by object ID:', error);
      throw error;
    }

    console.log('Found connections:', data);
    return data?.map(mapToEnergyConnection) || [];
  },

  // Create a new energy connection
  async createEnergyConnection(connectionData: Partial<EnergyConnection>) {
    const dbData = mapToDbConnection(connectionData);

    const { data, error } = await supabase
      .from('energy_connections')
      .insert([dbData])
      .select()
      .single();

    if (error) {
      console.error('Error creating energy connection:', error);
      throw error;
    }

    return mapToEnergyConnection(data);
  },

  // Update energy connection status
  async updateConnectionStatus(connectionId: string, status: string) {
    const { data, error } = await supabase
      .from('energy_connections')
      .update({ status })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) {
      console.error('Error updating connection status:', error);
      throw error;
    }

    return mapToEnergyConnection(data);
  },

  // Update energy connection
  async updateEnergyConnection(connection: Partial<EnergyConnection>) {
    try {
      if (!connection.id) {
        throw new Error('Connection ID is required for update');
      }

      console.log('Updating energy connection:', connection.id, connection);

      // Prepare data for Supabase
      const updateData: any = {
        address: connection.address,
        city: connection.city,
        postal_code: connection.postalCode,
        type: connection.type,
        status: connection.requestStatus,
        capacity: connection.capacity,
        grid_operator: connection.gridOperator,
        desired_connection_date: connection.desiredConnectionDate,
        grid_operator_work_number: connection.gridOperatorWorkNumber,
        ean: connection.ean,
        complex_id: connection.complexId,
        planned_connection_date: connection.plannedConnectionDate,
        last_modified: new Date().toISOString(),
        meter_role: connection.meterRole,
        metering_type: connection.meteringType
      };

      // Handle installer data
      if (connection.installer) {
        try {
          updateData.installer = typeof connection.installer === 'string'
            ? connection.installer
            : JSON.stringify(connection.installer);
        } catch (e) {
          console.error('Error converting installer data to JSON:', e);
        }
      }

      // Add special timestamp fields if present
      if (connection.inProgressDate) {
        updateData.in_progress_date = connection.inProgressDate;
      }

      if (connection.activationDate) {
        updateData.activation_date = connection.activationDate;
      }

      if (connection.isActiveSubscription !== undefined) {
        updateData.is_active_subscription = connection.isActiveSubscription;
      }

      const { data, error } = await supabase
        .from('energy_connections')
        .update(updateData)
        .eq('id', connection.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating energy connection:', error);
        toast({
          title: "Fout bij bijwerken aansluiting",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('Updated energy connection:', data);
      toast({
        title: "Aansluiting bijgewerkt",
        description: "De aansluitaanvraag is succesvol bijgewerkt.",
      });

      return mapEnergyConnectionFromDB(data);
    } catch (error) {
      console.error('Error in updateEnergyConnection:', error);
      toast({
        title: "Fout bij bijwerken aansluiting",
        description: (error as Error).message,
        variant: "destructive",
      });
      return null;
    }
  },

  // Set EAN code for connection (used when connection becomes active)
  async setEANCode(connectionId: string, ean: string) {
    const { data, error } = await supabase
      .from('energy_connections')
      .update({
        ean,
        status: 'actief',
        is_active_subscription: true,
        activation_date: new Date().toISOString()
      })
      .eq('id', connectionId)
      .select()
      .single();

    if (error) {
      console.error('Error setting EAN code:', error);
      throw error;
    }

    return mapToEnergyConnection(data);
  }
};
