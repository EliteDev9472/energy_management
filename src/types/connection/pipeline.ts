
export type ConnectionRequestStatus = 
  | 'NEW' 
  | 'IN_PROGRESS' 
  | 'OFFER_ACCEPTED' 
  | 'PLANNED' 
  | 'EXECUTION' 
  | 'CONNECTED' 
  | 'WAITING_FOR_EVI' 
  | 'WAITING_FOR_APPROVAL' 
  | 'CONTRACT_REQUEST' 
  | 'ACTIVE' 
  | 'COMPLETED' 
  | 'CANCELLED'
  | 'concept'
  | 'ingediend'
  | 'in_behandeling'
  | 'goedgekeurd'
  | 'aangesloten'
  | 'supplier_request'
  | 'aanmelden'
  | 'actief'
  | 'afmelden'
  | 'beëindigd';

export interface MeterType {
  id: string;
  name: string;
  description?: string;
}

export interface ConnectionPipeline {
  id: string;
  name: string;
  type: string;
  status: ConnectionRequestStatus;
  description?: string;
  steps?: ConnectionPipelineStep[];
}

export interface ConnectionPipelineStep {
  id: string;
  name: string;
  order: number;
  description?: string;
  isCompleted: boolean;
  isOptional?: boolean;
  connections?: string[];
}
