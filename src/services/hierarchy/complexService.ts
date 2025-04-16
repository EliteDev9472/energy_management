
import { supabase } from '@/integrations/supabase/client';
import { Complex, HierarchyObject } from '@/types/hierarchy';
import { BaseService } from './baseService';
import { toast } from '@/hooks/use-toast';

// Interface for the database complex
interface DBComplex {
  id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  description?: string;
  project_id: string;
  created_at: string;
  updated_at: string;
}

const complexBaseService = new BaseService('complexes');

export const complexService = {
  getComplexes: async (): Promise<Complex[]> => {
    try {
      const data = await complexBaseService.getAll<DBComplex>();

      // Transform DB data to Complex objects
      return data.map(complex => ({
        id: complex.id,
        name: complex.name,
        address: complex.address,
        city: complex.city,
        postalCode: complex.postal_code,
        description: complex.description,
        projectId: complex.project_id,
        objects: []
      }));
    } catch (error) {
      console.error('Error fetching complexes:', error);
      return [];
    }
  },

  getComplexById: async (id: string): Promise<Complex | null> => {
    try {
      console.info('Getting complex by ID:', id);
      const data = await complexBaseService.getById<DBComplex>(id);

      if (!data) return null;

      // Get objects linked to this complex
      const { data: objects, error: objectsError } = await supabase
        .from('objects')
        .select('*')
        .eq('complex_id', id);

      if (objectsError) {
        console.error('Error fetching objects for complex:', objectsError);
      }

      // Transform objects data
      const mappedObjects = (objects || []).map((obj: any) => ({
        id: obj.id,
        name: obj.name,
        address: obj.address,
        city: obj.city,
        postalcode: obj.postalcode,
        complexId: obj.complex_id,
        objectType: obj.object_type,
        buildPhase: obj.build_phase
      }));

      // Get the project data for additional context
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('name, category_id')
        .eq('id', data.project_id)
        .single();

      if (projectError) {
        console.error('Error fetching project for complex:', projectError);
      }

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        postalcode: data.postalcode,
        description: data.description,
        projectId: data.project_id,
        projectName: project?.name,
        categoryId: project?.category_id,
        objects: mappedObjects,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error(`Error fetching complex ${id}:`, error);
      return null;
    }
  },

  getComplexesByProject: async (projectId: string): Promise<Complex[]> => {
    try {
      const data = await complexBaseService.getByField<DBComplex>('project_id', projectId);

      // Transform DB data to Complex objects and count objects per complex
      const complexesWithObjects = await Promise.all(data.map(async (complex) => {
        const { count, error } = await supabase
          .from('objects')
          .select('*', { count: 'exact', head: true })
          .eq('complex_id', complex.id);

        if (error) {
          console.error('Error counting objects:', error);
        }

        return {
          id: complex.id,
          name: complex.name,
          address: complex.address,
          city: complex.city,
          postalCode: complex.postal_code,
          description: complex.description,
          projectId: complex.project_id,
          objectCount: count || 0,
          created_at: complex.created_at,
          updated_at: complex.updated_at
        };
      }));

      return complexesWithObjects;
    } catch (error) {
      console.error(`Error fetching complexes for project ${projectId}:`, error);
      return [];
    }
  },

  addComplex: async (complex: Omit<Complex, "id" | "objects">): Promise<Complex> => {
    try {
      // Make sure projectId is a valid UUID
      if (!complex.projectId) {
        toast({
          title: "Validatiefout",
          description: "Project ID is verplicht om een complex aan te maken",
          variant: "destructive",
        });
        throw new Error("Project ID is verplicht om een complex aan te maken");
      }

      const dataToInsert = {
        name: complex.name,
        address: complex.address,
        city: complex.city,
        postal_code: complex.postalCode,
        description: complex.description,
        project_id: complex.projectId
      };

      const data = await complexBaseService.create<DBComplex>(dataToInsert);

      return {
        id: data.id,
        name: data.name,
        address: data.address,
        city: data.city,
        postalCode: data.postal_code,
        description: data.description,
        projectId: data.project_id,
        objects: [],
        created_at: data.created_at,
        updated_at: data.updated_at
      };
    } catch (error) {
      console.error('Error adding complex:', error);
      toast({
        title: "Fout bij aanmaken complex",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    }
  },

  updateComplex: async (id: string, data: Partial<Complex>): Promise<Complex> => {
    try {
      const dataToUpdate: any = {};

      if (data.name) dataToUpdate.name = data.name;
      if (data.address) dataToUpdate.address = data.address;
      if (data.city) dataToUpdate.city = data.city;
      if (data.postalCode) dataToUpdate.postal_code = data.postalCode;
      if (data.description) dataToUpdate.description = data.description;
      if (data.projectId) dataToUpdate.project_id = data.projectId;

      const updatedData = await complexBaseService.update<DBComplex>(id, dataToUpdate);

      return {
        id: updatedData.id,
        name: updatedData.name,
        address: updatedData.address,
        city: updatedData.city,
        postalCode: updatedData.postal_code,
        description: updatedData.description,
        projectId: updatedData.project_id,
        objects: [],
        created_at: updatedData.created_at,
        updated_at: updatedData.updated_at
      };
    } catch (error) {
      console.error(`Error updating complex ${id}:`, error);
      toast({
        title: "Fout bij bijwerken complex",
        description: (error as Error).message,
        variant: "destructive",
      });
      throw error;
    }
  },

  deleteComplex: async (id: string): Promise<boolean> => {
    try {
      await complexBaseService.delete(id);
      return true;
    } catch (error) {
      console.error(`Error deleting complex ${id}:`, error);
      toast({
        title: "Fout bij verwijderen complex",
        description: (error as Error).message,
        variant: "destructive",
      });
      return false;
    }
  }
};
