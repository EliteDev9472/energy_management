
import { supabase } from '@/integrations/supabase/client';
import { ConnectionStatus } from '@/types/connection';
import { toast } from '@/hooks/use-toast';

/**
 * Service for managing connection requests in a hierarchical structure (Organization -> Entity -> Project -> Complex -> Object -> Connection)
 */
export const hierarchicalConnectionService = {
  /**
   * Get connection requests by object ID
   */
  getConnectionRequestsByObjectId: async (objectId: string) => {
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('object_id', objectId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error getting connection requests by object ID:", error);
      throw error;
    }
  },
  
  /**
   * Get connection requests by project ID
   */
  getConnectionRequestsByProjectId: async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('project_id', projectId);
      
      if (error) {
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error("Error getting connection requests by project ID:", error);
      throw error;
    }
  },
  
  /**
   * Create a new connection request
   * EAN is only added when status changes to 'CONNECTED'
   */
  createConnectionRequest: async (connectionRequest: any) => {
    try {
      // For a new connection, don't include EAN unless status is CONNECTED
      const requestData = { ...connectionRequest };
      
      // Remove EAN if status is not CONNECTED
      if (requestData.status !== 'CONNECTED' && requestData.status !== 'ACTIVE') {
        requestData.ean = null;
      }

      const { data, error } = await supabase
        .from('connection_requests')
        .insert([requestData])
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      // If status is IN_PROGRESS, charge the connection fee (€100)
      if (data.status === 'IN_PROGRESS') {
        try {
          await chargeConnectionFee(data.id, data.object_id);
        } catch (feeError) {
          console.error("Error charging connection fee:", feeError);
          // Continue despite fee error, but log it
        }
      }
      
      return data;
    } catch (error) {
      console.error("Error creating connection request:", error);
      throw error;
    }
  },
  
  /**
   * Update a connection request
   * Status changes trigger specific actions:
   * - Status change to IN_PROGRESS: Charge €100 connection fee
   * - Status change to CONNECTED: Add EAN if not present
   * - Status change to ACTIVE: Start monthly billing based on EAN (€25/month)
   */
  updateConnectionRequest: async (id: string, updates: any) => {
    try {
      // First, get the current request to compare status
      const { data: currentRequest, error: fetchError } = await supabase
        .from('connection_requests')
        .select('*')
        .eq('id', id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
      // If updating to IN_PROGRESS from another status, add connection fee
      if (updates.status === 'IN_PROGRESS' && currentRequest.status !== 'IN_PROGRESS') {
        try {
          await chargeConnectionFee(id, currentRequest.object_id);
        } catch (feeError) {
          console.error("Error charging connection fee:", feeError);
          // Continue despite fee error, but log it
        }
      }
      
      // If updating to CONNECTED, ensure EAN is provided or generate one
      if (updates.status === 'CONNECTED' && !updates.ean && !currentRequest.ean) {
        // Generate a random EAN for demonstration purposes
        updates.ean = generateRandomEan();
        toast({
          title: "EAN toegewezen",
          description: `Er is automatisch een EAN code toegewezen: ${updates.ean}`,
        });
      }
      
      // If updating to ACTIVE, start monthly billing if not already active
      if (updates.status === 'ACTIVE' && currentRequest.status !== 'ACTIVE' && (updates.ean || currentRequest.ean)) {
        try {
          await startMonthlyBilling(id, currentRequest.object_id, updates.ean || currentRequest.ean);
        } catch (billingError) {
          console.error("Error starting monthly billing:", billingError);
          // Continue despite billing error, but log it
        }
      }
      
      const { data, error } = await supabase
        .from('connection_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error("Error updating connection request:", error);
      throw error;
    }
  },
  
  /**
   * Delete a connection request
   */
  deleteConnectionRequest: async (id: string) => {
    try {
      const { error } = await supabase
        .from('connection_requests')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting connection request:", error);
      throw error;
    }
  }
};

// Helper function to charge connection fee (€100)
const chargeConnectionFee = async (connectionId: string, objectId: string) => {
  try {
    // Get the project ID from the object
    const { data: objectData, error: objectError } = await supabase
      .from('objects')
      .select('complex_id')
      .eq('id', objectId)
      .single();
    
    if (objectError) throw objectError;
    
    const { data: complexData, error: complexError } = await supabase
      .from('complexes')
      .select('project_id')
      .eq('id', objectData.complex_id)
      .single();
    
    if (complexError) throw complexError;
    
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('category_id')
      .eq('id', complexData.project_id)
      .single();
    
    if (projectError) throw projectError;
    
    // Create billing record
    const { error: billingError } = await supabase
      .from('billing_items')
      .insert({
        reference_id: connectionId,
        amount: 100, // €100 connection fee
        reference_type: 'connection',
        type: 'connection_fee',
        reference_name: 'Aansluitkosten',
        billable_from: new Date().toISOString(),
        // We would need to get the organization ID here in a real scenario
        organization_id: projectData.category_id // Temporary, should be the actual organization ID
      });
    
    if (billingError) throw billingError;
    
    return true;
  } catch (error) {
    console.error("Error in chargeConnectionFee:", error);
    return false;
  }
};

// Helper function to start monthly billing based on EAN (€25/month)
const startMonthlyBilling = async (connectionId: string, objectId: string, ean: string) => {
  try {
    // Get the project ID from the object
    const { data: objectData, error: objectError } = await supabase
      .from('objects')
      .select('complex_id')
      .eq('id', objectId)
      .single();
    
    if (objectError) throw objectError;
    
    const { data: complexData, error: complexError } = await supabase
      .from('complexes')
      .select('project_id')
      .eq('id', objectData.complex_id)
      .single();
    
    if (complexError) throw complexError;
    
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('category_id')
      .eq('id', complexData.project_id)
      .single();
    
    if (projectError) throw projectError;
    
    // Create billing record
    const { error: billingError } = await supabase
      .from('billing_items')
      .insert({
        reference_id: connectionId,
        amount: 25, // €25 monthly EAN fee
        reference_type: 'connection',
        type: 'monthly_ean_fee',
        reference_name: `Maandelijkse kosten EAN ${ean}`,
        billable_from: new Date().toISOString(),
        // We would need to get the organization ID here in a real scenario
        organization_id: projectData.category_id // Temporary, should be the actual organization ID
      });
    
    if (billingError) throw billingError;
    
    return true;
  } catch (error) {
    console.error("Error in startMonthlyBilling:", error);
    return false;
  }
};

// Generate a random EAN code for demonstration purposes
const generateRandomEan = (): string => {
  const prefix = "8716";
  let randomPart = "";
  for (let i = 0; i < 14; i++) {
    randomPart += Math.floor(Math.random() * 10);
  }
  return prefix + randomPart.substring(0, 14);
};

export default hierarchicalConnectionService;
