
/**
 * Connection filtering and display settings
 */

// Column visibility settings
export interface ColumnVisibility {
  ean: boolean;
  address: boolean;
  type: boolean;
  status: boolean;
  supplier: boolean;
  object: boolean;
  gridOperator: boolean;
  capacity: boolean;
  hasFeedback: boolean;
  plannedConnectionDate: boolean;
  actions: boolean;
  city?: boolean;
  postalCode?: boolean;
}

export const defaultColumnVisibility: ColumnVisibility = {
  ean: true,
  address: true,
  type: true,
  status: true,
  supplier: true,
  object: true,
  gridOperator: false,
  capacity: false,
  hasFeedback: false,
  plannedConnectionDate: false,
  actions: true
};

export interface ConnectionFilter {
  status?: string[];
  type?: string[];
  gridOperator?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  projectId?: string;
  search?: string;
}

export interface FilterSettings {
  status: string[];
  type: string[];
  gridOperator: string[];
  supplier: string[];
  dateRange: { from: string; to: string } | null;
  organizationId: string | null;
  entityId: string | null;
  categoryId: string | null;
  projectId: string | null;
  onlyProblems: boolean;
  sortBy: 'address' | 'status' | 'plannedConnectionDate';
  sortDirection: 'asc' | 'desc';
  hasActiveContract?: boolean | null;
  objectType?: string;
}

export interface ConnectionPreferences {
  columnVisibility: ColumnVisibility;
  itemsPerPage: number;
}
