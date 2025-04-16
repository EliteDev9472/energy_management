
import { Organization } from '@/types/hierarchy';
import { BaseService } from './baseService';

// Define the DB Organization type that matches our database structure
interface DBOrganization {
  id: string;
  name: string;
  description?: string;
  address?: string;
  city?: string;
}

const orgBaseService = new BaseService('organizations');

export const organizationService = {
  getOrganizations: async (): Promise<Organization[]> => {
    try {
      const data = await orgBaseService.getAll<DBOrganization>();
      
      return data.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description || '',
        address: org.address,
        city: org.city,
        entities: [] // Will be populated when needed
      }));
    } catch (error) {
      console.error('Error fetching organizations:', error);
      return [];
    }
  },
  
  getOrganizationById: async (id: string): Promise<Organization | null> => {
    try {
      const data = await orgBaseService.getById<DBOrganization>(id);
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address,
        city: data.city,
        entities: [] // Will be populated when needed
      };
    } catch (error) {
      console.error(`Error fetching organization ${id}:`, error);
      return null;
    }
  },
  
  addOrganization: async (organization: Omit<Organization, "id" | "entities">): Promise<Organization> => {
    try {
      const dataToInsert = {
        name: organization.name,
        description: organization.description,
        address: organization.address,
        city: organization.city
      };
      
      const data = await orgBaseService.create<DBOrganization>(dataToInsert);
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address,
        city: data.city,
        entities: []
      };
    } catch (error) {
      console.error('Error adding organization:', error);
      throw error;
    }
  },
  
  updateOrganization: async (updatedOrg: Organization): Promise<Organization> => {
    try {
      const dataToUpdate = {
        name: updatedOrg.name,
        description: updatedOrg.description,
        address: updatedOrg.address,
        city: updatedOrg.city
      };
      
      const data = await orgBaseService.update<DBOrganization>(updatedOrg.id, dataToUpdate);
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address,
        city: data.city,
        entities: updatedOrg.entities
      };
    } catch (error) {
      console.error(`Error updating organization ${updatedOrg.id}:`, error);
      throw error;
    }
  }
};
