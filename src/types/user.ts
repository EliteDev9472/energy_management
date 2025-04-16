
export type UserRole = 'admin' | 'consultant' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  organizationId?: string;
  organizationName?: string;
  assignedConsultantId?: string;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Admin',
  consultant: 'Consultant',
  client: 'Client'
};
