
import { supabase } from "@/integrations/supabase/client";

export interface Meter {
  id: string;
  name: string;
  type: string;
  role: 'main' | 'submeter' | 'mloea'; 
  ean?: string;
  status: string;
  objectId?: string;
}

export const meterService = {
  // Get all meters
  async getMeters() {
    const { data, error } = await supabase
      .from('meters')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meters:', error);
      throw error;
    }
    
    return (data || []).map(meter => ({
      id: meter.id,
      name: meter.name,
      type: meter.type,
      role: meter.role as 'main' | 'submeter' | 'mloea',
      ean: meter.ean,
      status: meter.status,
      objectId: meter.object_id
    }));
  },
  
  // Get meters by object ID
  async getMetersByObjectId(objectId: string) {
    const { data, error } = await supabase
      .from('meters')
      .select('*')
      .eq('object_id', objectId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching meters by object ID:', error);
      throw error;
    }
    
    return (data || []).map(meter => ({
      id: meter.id,
      name: meter.name,
      type: meter.type,
      role: meter.role as 'main' | 'submeter' | 'mloea',
      ean: meter.ean,
      status: meter.status,
      objectId: meter.object_id
    }));
  },
  
  // Create a new meter
  async createMeter(meterData: Omit<Meter, 'id'>) {
    const { data, error } = await supabase
      .from('meters')
      .insert([{
        name: meterData.name,
        type: meterData.type,
        role: meterData.role,
        ean: meterData.ean,
        status: meterData.status,
        object_id: meterData.objectId
      }])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating meter:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      role: data.role as 'main' | 'submeter' | 'mloea',
      ean: data.ean,
      status: data.status,
      objectId: data.object_id
    };
  },
  
  // Update a meter
  async updateMeter(meterId: string, meterData: Partial<Meter>) {
    const updateData: any = {};
    
    if (meterData.name) updateData.name = meterData.name;
    if (meterData.type) updateData.type = meterData.type;
    if (meterData.role) updateData.role = meterData.role;
    if (meterData.ean !== undefined) updateData.ean = meterData.ean;
    if (meterData.status) updateData.status = meterData.status;
    if (meterData.objectId) updateData.object_id = meterData.objectId;
    
    const { data, error } = await supabase
      .from('meters')
      .update(updateData)
      .eq('id', meterId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating meter:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      role: data.role as 'main' | 'submeter' | 'mloea',
      ean: data.ean,
      status: data.status,
      objectId: data.object_id
    };
  },
  
  // Delete a meter
  async deleteMeter(meterId: string) {
    const { error } = await supabase
      .from('meters')
      .delete()
      .eq('id', meterId);
    
    if (error) {
      console.error('Error deleting meter:', error);
      throw error;
    }
    
    return true;
  }
};
