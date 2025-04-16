
import { Organization } from '@/types/hierarchy';

export interface OrganizationWithDeletionInfo extends Organization {
  kvkNumber?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
  hasMandate?: boolean;
  pendingDeletion?: boolean;
  scheduledDeletionTime?: string;
  mandateFilePath?: string;
  invoiceName?: string;
  invoiceAddress?: string;
  invoiceCity?: string;
  invoicePostalCode?: string;
  iban?: string;
  bic?: string;
  vatNumber?: string;
}
