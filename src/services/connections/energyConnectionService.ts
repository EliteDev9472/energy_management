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
    metering_type: connection.meteringType
  };
};

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
  async updateEnergyConnection(connectionId: string, connectionData: Partial<EnergyConnection>) {
    const dbData = mapToDbConnection(connectionData);
    
    const { data, error } = await supabase
      .from('energy_connections')
      .update(dbData)
      .eq('id', connectionId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating energy connection:', error);
      throw error;
    }
    
    return mapToEnergyConnection(data);
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
