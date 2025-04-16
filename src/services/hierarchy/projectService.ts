
import { Project, BuildingPhase } from '@/types/hierarchy';
import { BaseService } from './baseService';
import { hierarchyValidationService } from './validation';
import { toast } from '@/hooks/use-toast';

// Define the DB Project type that matches our database structure
interface DBProject {
  id: string;
  name: string;
  project_number?: string;
  description?: string;
  status: string;
  start_date: string;
  end_date?: string;
  category_id?: string; 
  customer?: string;
  project_manager?: string;
  city?: string;
  building_phase?: string;
  address?: string;
  notes?: string;
  connection_count?: number;
  created_by: string;
  created_at?: string;
  updated_at?: string;
}

const projectBaseService = new BaseService('projects');

export const projectService = {
  getProjects: async (): Promise<Project[]> => {
    try {
      // Get all projects from the database
      const data = await projectBaseService.getAll<DBProject>();
      
      return data.map(project => ({
        id: project.id || '',
        name: project.name || '',
        projectNumber: project.project_number || '',
        description: project.description || '',
        status: project.status as "concept" | "in_aanvraag" | "lopend" | "afgerond",
        startDate: project.start_date || '',
        endDate: project.end_date || '',
        categoryId: project.category_id || '',
        categoryName: '',  // Will be populated when needed
        objects: [],
        customer: project.customer || '',
        projectManager: project.project_manager || '',
        city: project.city || '',
        address: project.address || '',
        buildingPhase: (project.building_phase || 'planning') as BuildingPhase,
        notes: project.notes || '',
        connectionCount: project.connection_count || 0,
        createdAt: project.created_at || new Date().toISOString(),
        updatedAt: project.updated_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },
  
  getProjectById: async (id: string): Promise<Project | null> => {
    try {
      // Get project by ID from the database
      const data = await projectBaseService.getById<DBProject>(id);
      
      if (!data) return null;
      
      return {
        id: data.id || '',
        name: data.name || '',
        projectNumber: data.project_number || '',
        description: data.description || '',
        status: data.status as "concept" | "in_aanvraag" | "lopend" | "afgerond",
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        categoryId: data.category_id || '',
        categoryName: '',  // Will be populated when needed
        objects: [],
        customer: data.customer || '',
        projectManager: data.project_manager || '',
        city: data.city || '',
        address: data.address || '',
        buildingPhase: (data.building_phase || 'planning') as BuildingPhase,
        notes: data.notes || '',
        connectionCount: data.connection_count || 0,
        createdAt: data.created_at || new Date().toISOString(),
        updatedAt: data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error fetching project ${id}:`, error);
      return null;
    }
  },
  
  getProjectsByCategory: async (categoryId: string): Promise<Project[]> => {
    try {
      // Get projects by category ID from the database
      const data = await projectBaseService.getByField<DBProject>('category_id', categoryId);
      
      return data.map(project => ({
        id: project.id || '',
        name: project.name || '',
        projectNumber: project.project_number || '',
        description: project.description || '',
        status: project.status as "concept" | "in_aanvraag" | "lopend" | "afgerond",
        startDate: project.start_date || '',
        endDate: project.end_date || '',
        categoryId: categoryId,
        categoryName: '',  // Will be populated when needed
        objects: [],
        customer: project.customer || '',
        projectManager: project.project_manager || '',
        city: project.city || '',
        address: project.address || '',
        buildingPhase: (project.building_phase || 'planning') as BuildingPhase,
        notes: project.notes || '',
        connectionCount: project.connection_count || 0,
        createdAt: project.created_at || new Date().toISOString(),
        updatedAt: project.updated_at || new Date().toISOString()
      }));
    } catch (error) {
      console.error(`Error fetching projects for category ${categoryId}:`, error);
      return [];
    }
  },
  
  addProject: async (project: Omit<Project, "id" | "objects" | "categoryName"> & { categoryId: string }, userId?: string): Promise<Project | null> => {
    try {
      // First validate that the project maintains the proper hierarchy
      console.log("Validating project data:", project);
      
      // Make sure projectManager is a valid UUID or null
      // If it's a simple ID (like "5"), we should handle it properly
      let projectManagerId = null;
      if (project.projectManager) {
        // Check if it's a UUID already
        if (typeof project.projectManager === 'string' && 
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(project.projectManager)) {
          projectManagerId = project.projectManager;
        } else {
          // For now, set it to null to avoid the UUID format error
          console.log("Invalid UUID format for project manager, setting to null:", project.projectManager);
          projectManagerId = null;
        }
      }
      
      // Check if userId is provided and valid
      if (!userId) {
        throw new Error("User ID is required to create a project");
      }
      
      const now = new Date().toISOString();
      
      // Map the project data to match the database structure
      const dataToInsert = {
        name: project.name,
        project_number: project.projectNumber,
        description: project.description,
        status: project.status,
        start_date: project.startDate,
        end_date: project.endDate,
        category_id: project.categoryId,
        customer: project.customer,
        project_manager: projectManagerId, // Use the processed projectManagerId
        city: project.city,
        address: project.address,
        building_phase: project.buildingPhase,
        notes: project.notes,
        created_by: userId, // Add the user ID to the data to insert
        created_at: now,
        updated_at: now
      };
      
      console.log("Inserting project data:", dataToInsert);
      
      // Pass the userId to the create method
      const data = await projectBaseService.create<DBProject>(dataToInsert);
      
      if (!data) {
        throw new Error("Failed to create project");
      }
      
      return {
        id: data.id,
        name: data.name,
        projectNumber: data.project_number || '',
        description: data.description || '',
        status: data.status as "concept" | "in_aanvraag" | "lopend" | "afgerond",
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        categoryId: project.categoryId,
        categoryName: '',
        objects: [],
        customer: data.customer || '',
        projectManager: data.project_manager || '',
        city: data.city || '',
        address: data.address || '',
        buildingPhase: data.building_phase || 'planning',
        notes: data.notes || '',
        connectionCount: data.connection_count || 0,
        createdAt: data.created_at || now,
        updatedAt: data.updated_at || now
      };
    } catch (error) {
      console.error('Error adding project:', error);
      toast({
        title: "Error creating project",
        description: (error as Error).message,
        variant: "destructive",
      });
      return null;
    }
  },
  
  updateProject: async (updatedProj: Project): Promise<Project | null> => {
    try {
      // First validate that the project maintains the proper hierarchy
      const isValid = await hierarchyValidationService.validateProject(updatedProj);
      if (!isValid) {
        toast({
          title: "Validation Error",
          description: "The project could not be updated because it does not maintain the proper hierarchy",
          variant: "destructive",
        });
        return null;
      }
      
      // Use the categoryId field 
      const categoryId = updatedProj.categoryId;
      
      const dataToUpdate = {
        name: updatedProj.name,
        project_number: updatedProj.projectNumber,
        description: updatedProj.description,
        status: updatedProj.status,
        start_date: updatedProj.startDate,
        end_date: updatedProj.endDate,
        category_id: categoryId,
        customer: updatedProj.customer,
        project_manager: updatedProj.projectManager,
        city: updatedProj.city,
        address: updatedProj.address,
        building_phase: updatedProj.buildingPhase,
        notes: updatedProj.notes,
        updated_at: new Date().toISOString()
      };
      
      const data = await projectBaseService.update<DBProject>(updatedProj.id, dataToUpdate);
      
      return {
        id: data.id || '',
        name: data.name || '',
        projectNumber: data.project_number || '',
        description: data.description || '',
        status: data.status as "concept" | "in_aanvraag" | "lopend" | "afgerond",
        startDate: data.start_date || '',
        endDate: data.end_date || '',
        categoryId: data.category_id || '',
        categoryName: updatedProj.categoryName || '',
        objects: updatedProj.objects || [],
        customer: data.customer || '',
        projectManager: data.project_manager || '',
        city: data.city || '',
        address: data.address || '',
        buildingPhase: data.building_phase || 'planning',
        notes: data.notes || '',
        connectionCount: data.connection_count || 0,
        createdAt: updatedProj.createdAt,
        updatedAt: data.updated_at || new Date().toISOString()
      };
    } catch (error) {
      console.error(`Error updating project ${updatedProj.id}:`, error);
      toast({
        title: "Error updating project",
        description: (error as Error).message,
        variant: "destructive",
      });
      return null;
    }
  }
};
