
import { OrganizationWithDeletionInfo } from './types';
import { organizationBasicService } from './organizationBasicService';
import { organizationDeletionService } from './organizationDeletionService';
import { organizationDocumentService } from './organizationDocumentService';

// Re-export types
export type { OrganizationWithDeletionInfo } from './types';

// Combine all organization services into a single API
export const organizationService = {
  // Basic CRUD operations
  getOrganizations: organizationBasicService.getOrganizations,
  getOrganizationById: organizationBasicService.getOrganizationById,
  updateOrganization: organizationBasicService.updateOrganization,
  
  // Deletion management
  markForDeletion: organizationDeletionService.markForDeletion,
  cancelDeletion: organizationDeletionService.cancelDeletion,
  deleteOrganization: organizationDeletionService.deleteOrganization,
  
  // Document handling
  uploadMandate: organizationDocumentService.uploadMandate
};
