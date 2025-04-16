
import { HierarchyObject } from '@/types/hierarchy';
import { BaseService } from './baseService';
import { supabase } from '@/integrations/supabase/client';
import { mapDbToObject } from './helpers';

// Define the database object structure
interface DBObject {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  object_type: string;
  build_phase: string;
  project_id: string;
  complex_id: string;
  complex_name: string;
  created_at: string;
  description?: string;
}

const objectBaseService = new BaseService('objects');

/**
 * Service for managing hierarchy objects
 */
export const objectService = {
  /**
   * Get all objects
   */
  getObjects: async (): Promise<HierarchyObject[]> => {
    try {
      const data = await objectBaseService.getAll<DBObject>();
      return data.map(mapDbToObject);
    } catch (error) {
      console.error('Error fetching objects:', error);
      return [];
    }
  },
  
  /**
   * Get a specific object by ID
   */
  getObjectById: async (id: string): Promise<HierarchyObject | null> => {
    try {
      const data = await objectBaseService.getById<DBObject>(id);
      
      if (!data) return null;
      
      return mapDbToObject(data);
    } catch (error) {
      console.error(`Error fetching object ${id}:`, error);
      return null;
    }
  },
  
  /**
   * Get all objects in a complex
   */
  getObjectsByComplex: async (complexId: string): Promise<HierarchyObject[]> => {
    try {
      console.log('Getting objects where complex_id=' + complexId);
      const { data, error } = await supabase
        .from('objects')
        .select('*')
        .eq('complex_id', complexId);
      
      if (error) throw error;
      
      return (data || []).map(mapDbToObject);
    } catch (error) {
      console.error(`Error fetching objects for complex ${complexId}:`, error);
      return [];
    }
  },
  
  /**
   * Get all objects in a project (via complexes)
   */
  getObjectsByProject: async (projectId: string): Promise<HierarchyObject[]> => {
    try {
      // First, get all complexes for this project
      const { data: complexes, error: complexError } = await supabase
        .from('complexes')
        .select('id')
        .eq('project_id', projectId);
        
      if (complexError) {
        console.error('Error fetching complexes for project:', complexError);
        return [];
      }
      
      if (!complexes || complexes.length === 0) {
        return [];
      }
      
      // Then, get all objects for these complexes
      const complexIds = complexes.map(c => c.id);
      const { data, error } = await supabase
        .from('objects')
        .select('*')
        .in('complex_id', complexIds);
        
      if (error) {
        console.error('Error fetching objects for complexes:', error);
        return [];
      }
      
      // Map the objects to HierarchyObject type
      const mappedObjects = data.map(obj => mapDbToObject(obj));
      
      // For each object, get connection counts
      const objectsWithConnections = await Promise.all(
        mappedObjects.map(async (obj) => {
          const { count, error } = await supabase
            .from('connections')
            .select('*', { count: 'exact', head: true })
            .eq('object_id', obj.id);
          
          if (error) {
            console.error('Error counting connections:', error);
          }
          
          return {
            ...obj,
            connectionCount: count || 0,
            connectionStatus: count && count > 0 ? 'connected' : 'none'
          };
        })
      );
      
      return objectsWithConnections;
    } catch (error) {
      console.error(`Error fetching objects for project ${projectId}:`, error);
      return [];
    }
  },
  
  /**
   * Add a new object
   */
  addObject: async (objectData: Partial<HierarchyObject>): Promise<HierarchyObject> => {
    try {
      // Convert to database format
      const dbObject = {
        name: objectData.name,
        address: objectData.address,
        city: objectData.city,
        postal_code: objectData.postalCode || objectData.postal_code,
        object_type: objectData.objectType || objectData.object_type || 'woning',
        build_phase: objectData.buildPhase || objectData.build_phase || 'voorbereiding',
        project_id: objectData.projectId || objectData.project_id,
        complex_id: objectData.complexId || objectData.complex_id,
        complex_name: objectData.complexName,
        description: objectData.description
      };
      
      const data = await objectBaseService.create<DBObject>(dbObject);
      
      return mapDbToObject(data);
    } catch (error) {
      console.error('Error adding object:', error);
      throw error;
    }
  },
  
  /**
   * Update an existing object
   */
  updateObject: async (id: string, objectData: Partial<HierarchyObject>): Promise<HierarchyObject> => {
    try {
      // Convert to database format
      const dbObject: Partial<DBObject> = {
        name: objectData.name,
        address: objectData.address,
        city: objectData.city,
        postal_code: objectData.postalCode || objectData.postal_code,
        object_type: objectData.objectType || objectData.object_type,
        build_phase: objectData.buildPhase || objectData.build_phase,
        project_id: objectData.projectId || objectData.project_id,
        complex_id: objectData.complexId || objectData.complex_id,
        complex_name: objectData.complexName,
        description: objectData.description
      };
      
      // Filter out undefined values
      const cleanedDbObject = Object.fromEntries(
        Object.entries(dbObject).filter(([_, v]) => v !== undefined)
      );
      
      const data = await objectBaseService.update<DBObject>(id, cleanedDbObject);
      
      return mapDbToObject(data);
    } catch (error) {
      console.error(`Error updating object ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Delete an object
   */
  deleteObject: async (id: string): Promise<boolean> => {
    try {
      return await objectBaseService.delete(id);
    } catch (error) {
      console.error(`Error deleting object ${id}:`, error);
      return false;
    }
  }
};

// Export both as default and named for compatibility
export default objectService;
