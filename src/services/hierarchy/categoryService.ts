
import { Category } from '@/types/hierarchy';
import { BaseService } from './baseService';
import { toast } from '@/hooks/use-toast';

// Interface for the database category
interface DBCategory {
  id: string;
  name: string;
  description: string;
  entity_id: string;
  created_at: string;
}

const categoryBaseService = new BaseService('categories');

export const categoryService = {
  getCategories: async (): Promise<Category[]> => {
    try {
      const data = await categoryBaseService.getAll<DBCategory>();
      
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        entity_id: category.entity_id,
        projects: []
      }));
    } catch (error) {
      console.error('Error fetching categories:', error);
      return [];
    }
  },
  
  getCategoryById: async (id: string): Promise<Category | null> => {
    try {
      const data = await categoryBaseService.getById<DBCategory>(id);
      
      if (!data) return null;
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        entity_id: data.entity_id,
        projects: []
      };
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }
  },
  
  getCategoriesByEntity: async (entityId: string): Promise<Category[]> => {
    try {
      const data = await categoryBaseService.getByField<DBCategory>('entity_id', entityId);
      
      return data.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        entity_id: category.entity_id,
        projects: []
      }));
    } catch (error) {
      console.error(`Error fetching categories for entity ${entityId}:`, error);
      return [];
    }
  },
  
  addCategory: async (category: Omit<Category, "id" | "projects">): Promise<Category | null> => {
    try {
      // Make sure entity_id is valid
      if (!category.entity_id) {
        toast({
          title: "Validation Error",
          description: "Entity ID is required to create a category",
          variant: "destructive",
        });
        return null;
      }
      
      const dataToInsert = {
        name: category.name,
        description: category.description,
        entity_id: category.entity_id
      };
      
      const data = await categoryBaseService.create<DBCategory>(dataToInsert);
      
      return {
        id: data.id,
        name: data.name,
        description: data.description,
        entity_id: data.entity_id,
        projects: []
      };
    } catch (error) {
      console.error('Error adding category:', error);
      toast({
        title: "Error creating category",
        description: (error as Error).message,
        variant: "destructive",
      });
      return null;
    }
  },
  
  updateCategory: async (id: string, data: Partial<Category>): Promise<Category | null> => {
    try {
      const dataToUpdate = {
        name: data.name,
        description: data.description,
        entity_id: data.entity_id
      };
      
      const updatedData = await categoryBaseService.update<DBCategory>(id, dataToUpdate);
      
      return {
        id: updatedData.id,
        name: updatedData.name,
        description: updatedData.description,
        entity_id: updatedData.entity_id,
        projects: data.projects || []
      };
    } catch (error) {
      console.error(`Error updating category ${id}:`, error);
      toast({
        title: "Error updating category",
        description: (error as Error).message,
        variant: "destructive",
      });
      return null;
    }
  },
  
  deleteCategory: async (id: string): Promise<boolean> => {
    try {
      await categoryBaseService.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting category ${id}:`, error);
      toast({
        title: "Error deleting category",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }
};
