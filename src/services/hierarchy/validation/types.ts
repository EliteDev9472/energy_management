
export interface HierarchyValidationService {
  validateFullHierarchy: (
    itemInfo: {
      objectId?: string;
      complexId?: string;
      projectId?: string;
      categoryId?: string;
      entityId?: string;
      organizationId?: string;
    },
    itemType: "connection" | "meter" | "document"
  ) => Promise<boolean>;
  getHierarchyPath: (
    id: string,
    type: "object" | "complex" | "project" | "category" | "entity"
  ) => Promise<any>;
  validateProjectBelongsToCategory: (projectId: string, categoryId: string) => Promise<boolean>;
  getProjectCategoryId: (projectId: string) => Promise<string | null>;
  validateObjectBelongsToProject: (objectId: string, projectId: string) => Promise<boolean>;
  validateObjectBelongsToComplex: (objectId: string, complexId: string) => Promise<boolean>;
  validateComplexBelongsToProject: (complexId: string, projectId: string) => Promise<boolean>;
  validateCategoryBelongsToEntity: (categoryId: string, entityId: string) => Promise<boolean>;
  validateEntityBelongsToOrganization: (entityId: string, organizationId: string) => Promise<boolean>;
  validateProject: (project: string | any) => Promise<boolean>;
}
