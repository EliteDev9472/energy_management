
import { supabase } from '@/integrations/supabase/client';
import {
  Organization,
  Entity,
  Category,
  Project,
  Complex,
  HierarchyObject
} from '@/types/hierarchy';
import { mapDbToEntity, mapDbToCategory, mapDbToProject, mapDbToComplex, mapDbToObject } from './hierarchy/helpers';

export const hierarchyService = {
  // Organizations
  getOrganizations: async (): Promise<Organization[]> => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*');

    if (error) {
      console.error('Error fetching organizations:', error);
      throw error;
    }

    return data || [];
  },

  getOrganizationById: async (id: string): Promise<Organization | null> => {
    const { data, error } = await supabase
      .from('organizations')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching organization ${id}:`, error);
      return null;
    }

    return data;
  },

  addOrganization: async (data: Partial<Organization>): Promise<Organization> => {
    const { data: newOrg, error } = await supabase
      .from('organizations')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error adding organization:', error);
      throw error;
    }

    return newOrg;
  },

  updateOrganization: async (id: string, data: Partial<Organization>): Promise<Organization> => {
    const { data: updatedOrg, error } = await supabase
      .from('organizations')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating organization ${id}:`, error);
      throw error;
    }

    return updatedOrg;
  },

  // Entities
  getEntities: async (): Promise<Entity[]> => {
    const { data, error } = await supabase
      .from('entities')
      .select('*');

    if (error) {
      console.error('Error fetching entities:', error);
      throw error;
    }

    return data.map(mapDbToEntity);
  },

  getEntityById: async (id: string): Promise<Entity | null> => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching entity ${id}:`, error);
      return null;
    }

    return mapDbToEntity(data);
  },

  getEntitiesByOrganization: async (organizationId: string): Promise<Entity[]> => {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('organization_id', organizationId);

    if (error) {
      console.error(`Error fetching entities for organization ${organizationId}:`, error);
      throw error;
    }

    return data.map(mapDbToEntity);
  },

  addEntity: async (data: Partial<Entity>): Promise<Entity> => {
    const { data: newEntity, error } = await supabase
      .from('entities')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error adding entity:', error);
      throw error;
    }

    return mapDbToEntity(newEntity);
  },

  updateEntity: async (id: string, data: Partial<Entity>): Promise<Entity> => {
    const { data: updatedEntity, error } = await supabase
      .from('entities')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating entity ${id}:`, error);
      throw error;
    }

    return mapDbToEntity(updatedEntity);
  },

  // Categories
  getCategories: async (): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*');

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }

    return data.map(mapDbToCategory);
  },

  getCategoryById: async (id: string): Promise<Category | null> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }

    return mapDbToCategory(data);
  },

  getCategoriesByEntity: async (entityId: string): Promise<Category[]> => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('entity_id', entityId);

    if (error) {
      console.error(`Error fetching categories for entity ${entityId}:`, error);
      throw error;
    }

    return data.map(mapDbToCategory);
  },

  addCategory: async (data: Partial<Category>): Promise<Category> => {
    const { data: newCategory, error } = await supabase
      .from('categories')
      .insert([data])
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }

    return mapDbToCategory(newCategory);
  },

  updateCategory: async (id: string, data: Partial<Category>): Promise<Category> => {
    const { data: updatedCategory, error } = await supabase
      .from('categories')
      .update(data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating category ${id}:`, error);
      throw error;
    }

    return mapDbToCategory(updatedCategory);
  },

  deleteCategory: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting category ${id}:`, error);
      throw error;
    }
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*');

    if (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }

    return data.map(mapDbToProject);
  },

  getProjectById: async (id: string): Promise<Project | null> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }

    return mapDbToProject(data);
  },

  getProjectsByCategory: async (categoryId: string): Promise<Project[]> => {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('category_id', categoryId);

    if (error) {
      console.error(`Error fetching projects for category ${categoryId}:`, error);
      throw error;
    }

    return data.map(mapDbToProject);
  },

  // Complexes
  getComplexes: async (): Promise<Complex[]> => {
    const { data, error } = await supabase
      .from('complexes')
      .select('*');

    if (error) {
      console.error('Error fetching complexes:', error);
      throw error;
    }

    return data.map(mapDbToComplex);
  },

  getComplexById: async (id: string): Promise<Complex | null> => {
    const { data, error } = await supabase
      .from('complexes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching complex ${id}:`, error);
      return null;
    }

    return mapDbToComplex(data);
  },

  getComplexesByProject: async (projectId: string): Promise<Complex[]> => {
    const { data, error } = await supabase
      .from('complexes')
      .select('*')
      .eq('project_id', projectId);

    if (error) {
      console.error(`Error fetching complexes for project ${projectId}:`, error);
      throw error;
    }

    return data.map(mapDbToComplex);
  },

  addComplex: async (complexData: {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    description?: string;
    projectId: string;
  }): Promise<Complex> => {
    const { data, error } = await supabase
      .from('complexes')
      .insert([{
        name: complexData.name,
        address: complexData.address,
        city: complexData.city,
        postal_code: complexData.postalCode,
        description: complexData.description,
        project_id: complexData.projectId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding complex:', error);
      throw error;
    }

    return mapDbToComplex(data);
  },

  deleteComplex: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('complexes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting complex ${id}:`, error);
      throw error;
    }
  },

  // Objects
  getObjectsByComplexId: async (complexId: string): Promise<HierarchyObject[]> => {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('complex_id', complexId);

    if (error) {
      console.error(`Error fetching objects for complex ${complexId}:`, error);
      throw error;
    }

    return data.map(mapDbToObject);
  },

  getObjectById: async (id: string): Promise<HierarchyObject | null> => {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching object ${id}:`, error);
      return null;
    }

    return mapDbToObject(data);
  },

  addObject: async (objectData: {
    name: string;
    objectType?: string;
    buildPhase?: string;
    address?: string;
    city?: string;
    postalcode?: string;
    complexId: string;
    complexName?: string;
    projectId?: string;
  }): Promise<HierarchyObject> => {
    const { data, error } = await supabase
      .from('objects')
      .insert([{
        name: objectData.name,
        object_type: objectData.objectType || 'woning',
        build_phase: objectData.buildPhase || 'voorbereiding',
        address: objectData.address,
        city: objectData.city,
        postalcode: objectData.postalcode,
        complex_name: objectData.complexName,
        project_id: objectData.projectId,
        complex_id: objectData.complexId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding object:', error);
      throw error;
    }

    return mapDbToObject(data);
  },

  deleteObject: async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('objects')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting object ${id}:`, error);
      return false;
    }

    return true;
  }
};
