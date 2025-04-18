
import { ConnectionRequestStatus } from "./pipeline";

export interface EnergyConnection {
  id: string;
  address: string;
  city?: string;
  postalCode?: string;
  type: string;
  status: string;
  requestStatus: ConnectionRequestStatus;
  capacity?: string;
  gridOperator?: string;
  projectId?: string;
  complexId?: string;
  objectId?: string;
  objectName?: string;
  requestDate?: string;
  desiredConnectionDate?: string;
  ean?: string;
  plannedConnectionDate?: string;
  gridOperatorWorkNumber?: string;
  inProgressDate?: string;
  activationDate?: string;
  isActiveSubscription?: boolean;
  installer?: any;
  meteringType?: string;
  hasFeedback?: boolean;
  meterRole?: 'main' | 'submeter' | 'mloea';
  name: string;
  email: string;
  phonenumber: string;
}
