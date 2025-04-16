
import { ConnectionRequestStatus } from '@/types/connection/pipeline';

export function handleDragStart(e: React.DragEvent, connectionId: string, status: ConnectionRequestStatus | string) {
  e.dataTransfer.setData('connectionId', connectionId);
  e.dataTransfer.setData('oldStatus', status.toString());
  e.dataTransfer.effectAllowed = 'move';
}

export function handleDragOver(e: React.DragEvent) {
  e.preventDefault();
  e.dataTransfer.dropEffect = 'move';
}

export function handleDrop(
  e: React.DragEvent, 
  newStatus: ConnectionRequestStatus | string,
  onStatusChange: (connectionId: string, oldStatus: string, newStatus: string) => void
) {
  e.preventDefault();
  const connectionId = e.dataTransfer.getData('connectionId');
  const oldStatus = e.dataTransfer.getData('oldStatus');
  
  if (connectionId && oldStatus !== newStatus) {
    onStatusChange(connectionId, oldStatus as ConnectionRequestStatus, newStatus as ConnectionRequestStatus);
  }
}

// Define valid status transitions
const validStatusTransitions: Record<string, ConnectionRequestStatus[]> = {
  'NEW': ['IN_PROGRESS', 'CANCELLED'],
  'IN_PROGRESS': ['OFFER_ACCEPTED', 'CANCELLED'],
  'OFFER_ACCEPTED': ['PLANNED', 'CANCELLED'],
  'PLANNED': ['EXECUTION', 'CANCELLED'],
  'EXECUTION': ['CONNECTED', 'CANCELLED'],
  'CONNECTED': ['CONTRACT_REQUEST', 'CANCELLED'],
  'CONTRACT_REQUEST': ['ACTIVE', 'CANCELLED'],
  'ACTIVE': ['COMPLETED', 'CANCELLED'],
  'WAITING_FOR_EVI': ['WAITING_FOR_APPROVAL', 'CANCELLED'],
  'WAITING_FOR_APPROVAL': ['PLANNED', 'CANCELLED'],
  'COMPLETED': [],
  'CANCELLED': ['NEW'],
  // Dutch statuses
  'concept': ['ingediend', 'CANCELLED'],
  'ingediend': ['in_behandeling', 'CANCELLED'],
  'in_behandeling': ['goedgekeurd', 'CANCELLED'],
  'goedgekeurd': ['aangesloten', 'CANCELLED'],
  'aangesloten': ['supplier_request', 'CANCELLED'],
  'supplier_request': ['aanmelden', 'CANCELLED'],
  'aanmelden': ['actief', 'CANCELLED'],
  'actief': ['afmelden', 'CANCELLED'],
  'afmelden': ['beëindigd', 'CANCELLED'],
  'beëindigd': []
};

export function isValidStatusTransition(
  oldStatus: ConnectionRequestStatus | string, 
  newStatus: ConnectionRequestStatus | string
): boolean {
  const validNextStatuses = validStatusTransitions[oldStatus] || [];
  return validNextStatuses.includes(newStatus as ConnectionRequestStatus);
}

export function formatStatusChange(
  oldStatus: ConnectionRequestStatus | string, 
  newStatus: ConnectionRequestStatus | string
): string {
  const statusNames: Record<string, string> = {
    'NEW': 'Nieuwe aanvraag',
    'IN_PROGRESS': 'In behandeling',
    'OFFER_ACCEPTED': 'Offerte geaccepteerd',
    'PLANNED': 'Gepland',
    'EXECUTION': 'Uitvoering',
    'CONNECTED': 'Aangesloten',
    'CONTRACT_REQUEST': 'Contract aanvragen',
    'ACTIVE': 'Actief',
    'COMPLETED': 'Afgerond',
    'CANCELLED': 'Geannuleerd',
    'WAITING_FOR_EVI': 'Wacht op EVI',
    'WAITING_FOR_APPROVAL': 'Wacht op goedkeuring',
    // Dutch statuses
    'concept': 'Concept',
    'ingediend': 'Ingediend',
    'in_behandeling': 'In behandeling',
    'goedgekeurd': 'Goedgekeurd',
    'aangesloten': 'Aangesloten',
    'supplier_request': 'Leveranciersaanvraag',
    'aanmelden': 'Aanmelden',
    'actief': 'Actief',
    'afmelden': 'Afmelden',
    'beëindigd': 'Beëindigd'
  };
  
  return `${statusNames[oldStatus] || oldStatus} → ${statusNames[newStatus] || newStatus}`;
}
