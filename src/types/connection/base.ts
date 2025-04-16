
export type ConnectionType = 
  | 'Elektriciteit' 
  | 'Gas' 
  | 'Water' 
  | 'Warmte'
  | 'electricity'
  | 'gas'
  | 'water'
  | 'heat'
  | string;  // Allow string for flexibility

export type ConnectionStatus = 
  | 'Actief' 
  | 'Inactief'
  | 'In aanvraag'
  | 'Storing'
  | 'Geblokkeerd'
  | 'Gepland'
  | 'Afgesloten'
  | 'active'
  | 'inactive'
  | 'pending'
  | 'maintenance'
  | 'blocked'
  | 'NEW'
  | 'IN_PROGRESS'
  | 'ACTIVE'
  | 'CANCELLED'
  | string;  // Allow string for flexibility

export const CONNECTION_STATUS_OPTIONS = {
  ACTIVE: 'Actief',
  INACTIVE: 'Inactief',
  REQUESTED: 'In aanvraag',
  CLOSED: 'Afgesloten',
  ERROR: 'Storing',
  BLOCKED: 'Geblokkeerd',
  PLANNED: 'Gepland'
};

export const CONNECTION_STATUS_LABELS = {
  'active': 'Actief',
  'inactive': 'Inactief',
  'pending': 'In aanvraag',
  'blocked': 'Geblokkeerd',
  'error': 'Storing',
  'planned': 'Gepland'
};

export const CONNECTION_TYPE_OPTIONS = {
  ELECTRICITY: 'Elektriciteit',
  GAS: 'Gas',
  WATER: 'Water',
  HEAT: 'Warmte'
};

// Base Connection interface
export interface Connection {
  id: string;
  ean?: string;  // Make optional to match schema
  address: string;
  city: string;
  postalCode: string;
  type: ConnectionType;
  status: ConnectionStatus;
  supplier?: string;
  object?: string;
  entity?: string;
  organization?: string;
  project?: string;
  complex?: string; 
  complexId?: string; // Add complexId property
  gridOperator?: string;
  capacity?: string;
  yearlyConsumption?: number;
  monthlyCost?: number;
  notes?: string;
  contractEndDate?: string;
  meteringCompany?: string;
  lastModified?: string;
  hasFeedback?: boolean;
  meteringType?: string;
  plannedConnectionDate?: string;
  contract?: {
    endDate: string;
    price: string;
    type: string;
    startDate: string;
    conditions: string;
  };
}

// Contract Details
export interface Contract {
  id: string;
  connectionId: string;
  startDate: string;
  endDate: string;
  type: string;
  price: string;
  conditions?: string;
}
