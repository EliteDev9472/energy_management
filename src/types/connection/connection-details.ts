
/**
 * Types for detailed connection information
 */

export interface Connection {
  id: string;
  ean: string;
  address: string;
  city: string;
  postalCode: string;
  type: string;
  status: string;
  supplier: string;
  object: string;
  objectName?: string;
  entity: string;
  entityName?: string;
  category?: string;
  categoryName?: string;
  organization?: string;
  organizationName?: string;
  project?: string;
  projectName?: string;
  capacity?: string;
  meterType?: string;
  meterNumber?: string;
  contract: {
    endDate: string;
    price: string;
    type?: string;
    startDate?: string;
    conditions?: string;
  };
  gridOperator: string;
  hasFeedback?: boolean;
  plannedConnectionDate?: string;
  lastModified?: string;
  meteringCompany?: string;
  connectionAddress?: string;
  gridOperatorContact?: string;
  gridOperatorWorkNumber?: string;
  technicalSpecifications?: {
    voltage?: string;
    phases?: string;
    maxCapacity?: string;
    connectionFee?: string;
    meteringType?: string;
  };
  technicalDocuments?: Array<{
    id: string;
    name: string;
    uploadDate: string;
  }>;
  history?: Array<{
    date: string;
    event: string;
    description: string;
    status: string;
  }>;
  lastUsage?: {
    date: string;
    value: string;
    unit: string;
  };
}
