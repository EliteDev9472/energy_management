
import { ConnectionType, ConnectionStatus, Connection as BaseConnection, Contract } from './base';

// Export the base types
export { ConnectionType, ConnectionStatus, Contract };

// Extended Connection type
export interface Connection extends BaseConnection {
  // Additional properties specific to the application
  hasFeedback?: boolean;
  meteringType?: string;
  complexId?: string; // Added to match the schema
}

// Connection form data
export interface ConnectionFormData {
  address: string;
  city: string;
  postalCode: string;
  type: ConnectionType;
  status: ConnectionStatus;
  gridOperator?: string;
  ean?: string;
  capacity?: string;
  meteringCompany?: string;
  supplier?: string;
  organization: string;
  entity: string;
  project: string;
  complex: string; 
  complexId: string; // Added to match the schema
  object: string;
  gridOperatorWorkNumber?: string;
  gridOperatorContact?: string;
  meteringType?: string;
}

// Connection filter settings
export interface ConnectionFilterSettings {
  type?: ConnectionType[];
  status?: ConnectionStatus[];
  dateRange?: {
    from: Date;
    to: Date;
  };
  search?: string;
  organization?: string;
  entity?: string;
  project?: string;
}

export interface ConnectionSearchParams {
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  search?: string;
  organization?: string;
  entity?: string;
  project?: string;
}

export interface ConnectionDetailsTabProps {
  connection: Connection;
  onUpdate?: (updatedConnection: Partial<Connection>) => Promise<void>;
}
