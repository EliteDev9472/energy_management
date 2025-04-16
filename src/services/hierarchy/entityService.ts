
import { Entity } from '@/types/hierarchy';
import { BaseService } from './baseService';
import { toast } from '@/hooks/use-toast';
import { mapDbToEntity } from './helpers';

// Define the DB Entity type that matches our database structure
interface DBEntity {
  id: string;
  name: string;
  description?: string;
  organization_id: string;
  organization_name?: string;
  created_at?: string;
}

const entityBaseService = new BaseService('entities');

export const entityService = {
  getEntities: async (): Promise<Entity[]> => {
    try {
      console.log('Fetching all entities');
      const data = await entityBaseService.getAll<DBEntity>();
      console.log('Entities fetched:', data);
      
      return data.map(mapDbToEntity);
    } catch (error) {
      console.error('Error fetching entities:', error);
      return [];
    }
  },
  
  getEntityById: async (id: string): Promise<Entity | null> => {
    try {
      console.log(`Fetching entity by ID: ${id}`);
      const data = await entityBaseService.getById<DBEntity>(id);
      
      if (!data) {
        console.log(`Entity with ID ${id} not found`);
        return null;
      }
      
      console.log(`Entity found:`, data);
      
      return mapDbToEntity(data);
    } catch (error) {
      console.error(`Error fetching entity ${id}:`, error);
      return null;
    }
  },
  
  getEntitiesByOrganization: async (organizationId: string): Promise<Entity[]> => {
    try {
      console.log('Fetching entities for organization:', organizationId);
      const data = await entityBaseService.getByField<DBEntity>('organization_id', organizationId);
      
      console.log('Entities found:', data);
      
      return data.map(mapDbToEntity);
    } catch (error) {
      console.error(`Error fetching entities for organization ${organizationId}:`, error);
      return [];
    }
  },
  
  addEntity: async (entity: Omit<Entity, 'id' | 'categories'>): Promise<Entity> => {
    try {
      // Get the organizationId from the entity
      const organization_id = entity.organization_id || entity.organizationId;
        
      if (!organization_id) {
        console.error('Entity must have an organization ID', entity);
        throw new Error('Entiteit moet een organisatie hebben');
      }
      
      const dataToInsert = {
        name: entity.name,
        description: entity.description || '',
        organization_id: organization_id
      };
      
      console.log('Adding entity with data:', dataToInsert);
      
      const data = await entityBaseService.create<DBEntity>(dataToInsert);
      
      toast({
        title: "Entiteit aangemaakt",
        description: `${entity.name} is succesvol aangemaakt.`
      });
      
      console.log('Created entity:', data);
      
      return mapDbToEntity(data);
    } catch (error) {
      console.error('Error adding entity:', error);
      toast({
        title: "Fout bij aanmaken entiteit",
        description: error instanceof Error ? error.message : `Er is een fout opgetreden bij het aanmaken van de entiteit.`,
        variant: "destructive"
      });
      throw error;
    }
  },
  
  updateEntity: async (id: string, data: Partial<Entity>): Promise<Entity> => {
    try {
      const dataToUpdate = {
        name: data.name,
        description: data.description || '',
        organization_id: data.organization_id || data.organizationId
      };
      
      const updatedData = await entityBaseService.update<DBEntity>(id, dataToUpdate);
      
      return mapDbToEntity(updatedData);
    } catch (error) {
      console.error(`Error updating entity ${id}:`, error);
      throw error;
    }
  }
};
