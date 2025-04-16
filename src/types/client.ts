
export interface Client {
  id: string;
  name: string;
  address?: string;
  city?: string;
  email?: string;
  assignedConsultantId?: string;
  assignedConsultantName?: string;
  userCount: number;
  created_at: string;
  updated_at?: string;
}

export interface Organization {
  id: string;
  name: string;
  address?: string;
  city?: string;
  description?: string;
  userCount: number;
  created_at: string;
  assignedConsultantId?: string;
  assignedConsultantName?: string;
}
