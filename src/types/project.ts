export type ProjectStatus = 'concept' | 'in_aanvraag' | 'lopend' | 'afgerond';
export type BuildingPhase = 'planning' | 'ontwerp' | 'constructie' | 'afwerking' | 'oplevering' | 'onderhoud';
export type ConnectionRequestStatus = 'concept' | 'ingediend' | 'in_behandeling' | 'goedgekeurd' | 'aangesloten' |
  'NEW' | 'IN_PROGRESS' | 'OFFER_ACCEPTED' | 'PLANNED' | 'EXECUTION' | 'CONNECTED' |
  'WAITING_FOR_EVI' | 'WAITING_FOR_APPROVAL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'supplier_request' | 'CONTRACT_REQUEST';
export type EnergyContractStatus = 'aanmelden' | 'ingediend' | 'actief' | 'afmelden' | 'beëindigd';

export interface TeamMember {
  id: string;
  name: string;
  role: 'projectmanager' | 'consultant' | 'klantcontact' | 'team_member';
  avatar?: string;
  email: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  assignedTo: string | null;
  dueDate: string | null;
  status: 'open' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ProjectComment {
  id: string;
  text: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  createdByAvatar?: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  name: string;
  address: string;
  city: string;
  customer: string;
  buildingPhase: BuildingPhase;
  status: ProjectStatus;
  startDate: string;
  endDate: string | null;
  projectManager: string;
  connectionCount: number;
  notes: string;
  documents: ProjectDocument[];
  team: TeamMember[];
  tasks: ProjectTask[];
  comments: ProjectComment[];
  connectionRequests?: ConnectionRequest[]; // Optional field for connection requests
  createdAt: string;
  updatedAt: string;
  description?: string;
  categoryId: string;
  categoryName?: string;
  objects?: any[];
}

export interface EmailLog {
  date: string;
  recipient: string;
  subject: string;
  type: 'grid_operator_request' | 'client_confirmation' | 'offer_request' | 'status_update' | 'supplier_request';
  content?: string;
}

export interface ConnectionRequest {
  id: string;
  objectId?: string;
  objectName?: string;
  projectId?: string; // Add this for compatibility with mock data
  address: string;
  city?: string;
  postalCode?: string;
  type: 'electricity' | 'gas';
  capacity?: string;
  gridOperator?: string;
  status: ConnectionRequestStatus;
  requestDate: string;
  desiredConnectionDate: string;
  ean?: string;
  plannedConnectionDate?: string;
  gridOperatorWorkNumber?: string;
  emailLogs?: EmailLog[];
  connectionDate?: string;
  installer?: string;
  installerEmail?: string;
  installerPhone?: string;
  supplier?: string; // Add this for compatibility with EnergyContractPipeline
}

export interface ConnectionConsumption {
  peakUsage?: number;
  offPeakUsage?: number;
  hasEnergyReturn: boolean;
  peakReturn?: number;
  offPeakReturn?: number;
  gasUsage?: number;
  unknownConsumption: boolean;
}

export interface EnergyContract {
  id: string;
  projectId: string;
  ean: string;
  address: string;
  type: 'gas' | 'electricity';
  status: EnergyContractStatus;
  supplier: string;
  startDate: string;
  endDate?: string;
  rate?: string;
  customerNumber?: string;
  contactPerson?: string;
  emailLogs?: EmailLog[];
  // Connection consumption data
  consumption?: ConnectionConsumption;
}
