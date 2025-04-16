
import { supabase } from '@/integrations/supabase/client';
import { Organization } from '@/types/hierarchy';
import { toast } from '@/hooks/use-toast';
import { OrganizationWithDeletionInfo } from './types';

/**
 * Basic CRUD operations for organizations
 */
export const organizationBasicService = {
  /**
   * Get all organizations
   */
  getOrganizations: async (): Promise<OrganizationWithDeletionInfo[]> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching organizations:', error);
        throw error;
      }

      return data.map(org => ({
        id: org.id,
        name: org.name,
        description: org.description || '',
        address: org.address,
        city: org.city,
        entities: [],
        kvkNumber: org.kvk_number,
        ownerName: org.owner_name,
        ownerEmail: org.owner_email,
        ownerPhone: org.owner_phone,
        hasMandate: org.has_mandate,
        pendingDeletion: org.pending_deletion,
        scheduledDeletionTime: org.scheduled_deletion_time,
        mandateFilePath: org.mandate_file_path,
        // Add billing fields with fallbacks
        invoiceName: org.invoice_name || '',
        invoiceAddress: org.invoice_address || '',
        invoiceCity: org.invoice_city || '',
        invoicePostalCode: org.invoice_postal_code || '',
        iban: org.iban || '',
        bic: org.bic || '',
        vatNumber: org.vat_number || ''
      }));
    } catch (error) {
      console.error('Error in getOrganizations:', error);
      return [];
    }
  },
  
  /**
   * Get organization by ID
   */
  getOrganizationById: async (id: string): Promise<OrganizationWithDeletionInfo | null> => {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error(`Error fetching organization ${id}:`, error);
        throw error;
      }

      if (!data) return null;

      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address || '',
        city: data.city || '',
        entities: [],
        kvkNumber: data.kvk_number,
        ownerName: data.owner_name,
        ownerEmail: data.owner_email,
        ownerPhone: data.owner_phone,
        hasMandate: data.has_mandate,
        pendingDeletion: data.pending_deletion,
        scheduledDeletionTime: data.scheduled_deletion_time,
        mandateFilePath: data.mandate_file_path,
        // Add billing fields with fallbacks
        invoiceName: data.invoice_name || '',
        invoiceAddress: data.invoice_address || '',
        invoiceCity: data.invoice_city || '',
        invoicePostalCode: data.invoice_postal_code || '',
        iban: data.iban || '',
        bic: data.bic || '',
        vatNumber: data.vat_number || ''
      };
    } catch (error) {
      console.error(`Error in getOrganizationById:`, error);
      return null;
    }
  },
  
  /**
   * Update organization
   */
  updateOrganization: async (organization: Partial<OrganizationWithDeletionInfo>): Promise<OrganizationWithDeletionInfo | null> => {
    try {
      const { id, ...updateData } = organization;
      
      if (!id) {
        throw new Error('Organization ID is required');
      }
      
      // Transform the data for database format
      const dbUpdateData: any = {
        name: updateData.name,
        description: updateData.description,
        address: updateData.address,
        city: updateData.city,
        kvk_number: updateData.kvkNumber,
        owner_name: updateData.ownerName,
        owner_email: updateData.ownerEmail,
        owner_phone: updateData.ownerPhone,
        has_mandate: updateData.hasMandate,
        pending_deletion: updateData.pendingDeletion,
        scheduled_deletion_time: updateData.scheduledDeletionTime,
        // Add billing fields
        invoice_name: updateData.invoiceName,
        invoice_address: updateData.invoiceAddress,
        invoice_city: updateData.invoiceCity,
        invoice_postal_code: updateData.invoicePostalCode,
        iban: updateData.iban,
        bic: updateData.bic,
        vat_number: updateData.vatNumber
      };
      
      // Filter out undefined values
      Object.keys(dbUpdateData).forEach(key => {
        if (dbUpdateData[key] === undefined) {
          delete dbUpdateData[key];
        }
      });
      
      const { data, error } = await supabase
        .from('organizations')
        .update(dbUpdateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating organization:', error);
        throw error;
      }
      
      return {
        id: data.id,
        name: data.name,
        description: data.description || '',
        address: data.address || '',
        city: data.city || '',
        entities: [],
        kvkNumber: data.kvk_number,
        ownerName: data.owner_name,
        ownerEmail: data.owner_email,
        ownerPhone: data.owner_phone,
        hasMandate: data.has_mandate,
        pendingDeletion: data.pending_deletion,
        scheduledDeletionTime: data.scheduled_deletion_time,
        mandateFilePath: data.mandate_file_path,
        // Add billing fields with fallbacks
        invoiceName: data.invoice_name || '',
        invoiceAddress: data.invoice_address || '',
        invoiceCity: data.invoice_city || '',
        invoicePostalCode: data.invoice_postal_code || '',
        iban: data.iban || '',
        bic: data.bic || '',
        vatNumber: data.vat_number || ''
      };
    } catch (error) {
      console.error('Error in updateOrganization:', error);
      toast({
        title: "Fout bij bijwerken organisatie",
        description: "Er is een fout opgetreden bij het bijwerken van de organisatie.",
        variant: "destructive",
      });
      return null;
    }
  }
};
