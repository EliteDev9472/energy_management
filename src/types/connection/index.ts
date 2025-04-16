
import { Connection as BaseConnection, ConnectionStatus, ConnectionType } from './base';
export * from './base';
export * from './pipeline';
export * from './filter-settings';
export * from './energy-connection';

export interface Connection extends Omit<BaseConnection, 'ean'> {
  id: string;
  hasFeedback: boolean;
  organization?: string;
  entity?: string;
  project?: string;
  object?: string;
  gridOperatorWorkNumber?: string;
  connectionAddress?: string;
  gridOperatorContact?: string;
  plannedConnectionDate?: string;
  meteringType?: string;
  ean?: string;
  technicalSpecifications?: {
    voltage?: string;
    phases?: string;
    maxCapacity?: string;
    connectionFee?: string;
    meteringType?: string;
  };
  contract?: {
    endDate: string;
    price: string;
    type: string;
    startDate: string;
    conditions: string;
  };
  history?: Array<{date: string, action: string, user: string}>;
}

// Export for the ColumnManager
export interface ColumnVisibility {
  id: boolean;
  address: boolean;
  city: boolean;
  postalCode: boolean;
  type: boolean;
  status: boolean;
  supplier: boolean;
  ean: boolean;
  gridOperator: boolean;
  capacity: boolean;
  yearlyConsumption: boolean;
  monthlyCost: boolean;
  contractEndDate: boolean;
  object: boolean;
  entity: boolean;
  organization: boolean;
  lastModified: boolean;
  hasFeedback: boolean;
  plannedConnectionDate: boolean;
  actions: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  id: false,
  address: true,
  city: true,
  postalCode: true,
  type: true,
  status: true,
  supplier: true,
  ean: true,
  gridOperator: true,
  capacity: true,
  yearlyConsumption: false,
  monthlyCost: false,
  contractEndDate: true,
  object: false,
  entity: false,
  organization: false,
  lastModified: false,
  hasFeedback: true,
  plannedConnectionDate: true,
  actions: true
};
