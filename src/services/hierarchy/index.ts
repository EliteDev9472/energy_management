
import { HierarchyService, Organization, Entity, Category, Project, Complex, HierarchyObject } from '@/types/hierarchy';
import { organizationService } from './organizationService';
import { entityService } from './entityService';
import { categoryService } from './categoryService';
import { projectService } from './projectService';
import { complexService } from './complexService';
import { objectService } from './objectService';

// Export individual services for direct access
export {
  organizationService,
  entityService,
  categoryService,
  projectService,
  complexService,
  objectService
};

// Export a combined service that implements the HierarchyService interface
export const hierarchyService: HierarchyService = {
  // Organizations
  getOrganizations: organizationService.getOrganizations,
  getOrganizationById: organizationService.getOrganizationById,
  addOrganization: organizationService.addOrganization,
  updateOrganization: async (id: string, data: Partial<Organization>) => {
    const org = await organizationService.getOrganizationById(id);
    if (!org) throw new Error(`Organization with id ${id} not found`);
    return organizationService.updateOrganization(id, data);
  },
  
  // Entities
  getEntities: entityService.getEntities,
  getEntityById: entityService.getEntityById,
  getEntitiesByOrganization: entityService.getEntitiesByOrganization,
  addEntity: entityService.addEntity,
  updateEntity: async (id: string, data: Partial<Entity>) => {
    const entity = await entityService.getEntityById(id);
    if (!entity) throw new Error(`Entity with id ${id} not found`);
    return entityService.updateEntity(id, data);
  },
  
  // Categories
  getCategories: categoryService.getCategories,
  getCategoryById: categoryService.getCategoryById,
  getCategoriesByEntity: categoryService.getCategoriesByEntity,
  addCategory: categoryService.addCategory,
  updateCategory: async (id: string, data: Partial<Category>) => {
    const category = await categoryService.getCategoryById(id);
    if (!category) throw new Error(`Category with id ${id} not found`);
    const result = await categoryService.updateCategory(id, data);
    if (!result) throw new Error(`Failed to update category ${id}`);
    return result;
  },
  deleteCategory: async (id: string): Promise<void> => {
    const success = await categoryService.deleteCategory(id);
    if (!success) throw new Error(`Failed to delete category ${id}`);
  },
  
  // Projects
  getProjects: projectService.getProjects,
  getProjectById: async (id: string) => {
    const project = await projectService.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} not found`);
    return project;
  },
  getProjectsByCategory: projectService.getProjectsByCategory,
  addProject: projectService.addProject,
  updateProject: async (id: string, data: Partial<Project>) => {
    const project = await projectService.getProjectById(id);
    if (!project) throw new Error(`Project with id ${id} not found`);
    const updatedProject = await projectService.updateProject(id, data);
    if (!updatedProject) throw new Error(`Failed to update project ${id}`);
    return updatedProject;
  },
  
  // Complexes
  getComplexes: complexService.getComplexes,
  getComplexById: complexService.getComplexById,
  getComplexesByProject: complexService.getComplexesByProject,
  addComplex: complexService.addComplex,
  updateComplex: async (id: string, data: Partial<Complex>) => {
    const complex = await complexService.getComplexById(id);
    if (!complex) throw new Error(`Complex with id ${id} not found`);
    return complexService.updateComplex(id, data);
  },
  deleteComplex: async (id: string): Promise<void> => {
    const success = await complexService.deleteComplex(id);
    if (!success) throw new Error(`Failed to delete complex ${id}`);
  },
  
  // Objects
  getObjects: objectService.getObjects,
  getObjectById: objectService.getObjectById,
  getObjectsByComplex: objectService.getObjectsByComplex,
  getObjectsByComplexId: objectService.getObjectsByComplex, // Alias for compatibility
  getObjectsByProject: objectService.getObjectsByProject,
  addObject: objectService.addObject,
  updateObject: async (id: string, data: Partial<HierarchyObject>) => {
    const object = await objectService.getObjectById(id);
    if (!object) throw new Error(`Object with id ${id} not found`);
    return objectService.updateObject(id, data);
  },
  deleteObject: async (id: string): Promise<void> => {
    const success = await objectService.deleteObject(id);
    if (!success) throw new Error(`Failed to delete object ${id}`);
  }
};

// Add additional aliases for function naming consistency to support legacy code
export const getEntitiesByOrganizationId = entityService.getEntitiesByOrganization; 
export const getCategoriesByEntityId = categoryService.getCategoriesByEntity;
export const getProjectsByCategoryId = projectService.getProjectsByCategory;
export const getComplexesByProjectId = complexService.getComplexesByProject;
export const getObjectsByComplexId = objectService.getObjectsByComplex;
export const getObjectsByProjectId = objectService.getObjectsByProject;
export const addProject = projectService.addProject;

// Export individual functions for convenience
export const getProjects = hierarchyService.getProjects;
export const getOrganizations = hierarchyService.getOrganizations;
export const getEntities = hierarchyService.getEntities;
export const getCategories = hierarchyService.getCategories;
export const getEntitiesByOrganization = hierarchyService.getEntitiesByOrganization;
export const getCategoriesByEntity = hierarchyService.getCategoriesByEntity;
export const getProjectsByCategory = hierarchyService.getProjectsByCategory;
export const getComplexesByProject = hierarchyService.getComplexesByProject;
export const getObjectsByComplex = hierarchyService.getObjectsByComplex;
export const getObjectsByProject = hierarchyService.getObjectsByProject;
export const addComplex = hierarchyService.addComplex;
export const addObject = hierarchyService.addObject;
export const deleteObject = hierarchyService.deleteObject;
export const deleteComplex = hierarchyService.deleteComplex;
export const deleteCategory = hierarchyService.deleteCategory;
