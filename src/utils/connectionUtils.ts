
import { Connection, FilterSettings } from "@/types/connection";

export const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'Actief':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'In aanvraag':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'Inactief':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    case 'Geblokkeerd':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
    case 'Storing':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const filterConnections = (connections: Connection[], searchQuery: string, filters: FilterSettings) => {
  // First filter the connections
  const filtered = connections.filter(connection => {
    const matchesSearch = searchQuery === '' || 
      connection.ean.toLowerCase().includes(searchQuery.toLowerCase()) || 
      connection.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.object.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filters.type.length === 0 || filters.type.includes(connection.type);
    
    const matchesStatus = filters.status.length === 0 || filters.status.includes(connection.status);
    
    const matchesSupplier = filters.supplier.length === 0 || filters.supplier.includes(connection.supplier);
    
    const matchesGridOperator = filters.gridOperator.length === 0 || filters.gridOperator.includes(connection.gridOperator);
    
    const matchesActiveContract = filters.hasActiveContract === null || 
      (filters.hasActiveContract && new Date(connection.contract.endDate) > new Date()) ||
      (!filters.hasActiveContract && new Date(connection.contract.endDate) <= new Date());
    
    const matchesObjectType = !filters.objectType || 
      connection.object.toLowerCase().includes(filters.objectType.toLowerCase());
    
    const matchesOrganization = !filters.organizationId || 
      connection.organization === filters.organizationId;
    
    return matchesSearch && matchesType && matchesStatus && matchesSupplier && 
      matchesGridOperator && matchesActiveContract && matchesObjectType && matchesOrganization;
  });

  // Then sort the filtered connections if sort options are provided
  if (filters.sortBy) {
    return sortConnections(filtered, filters.sortBy, filters.sortDirection || 'asc');
  }
  
  return filtered;
};

export const sortConnections = (connections: Connection[], sortBy: string, direction: 'asc' | 'desc') => {
  return [...connections].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'address':
        valueA = a.address.toLowerCase();
        valueB = b.address.toLowerCase();
        break;
      case 'status':
        valueA = a.status;
        valueB = b.status;
        break;
      case 'plannedConnectionDate':
        valueA = a.plannedConnectionDate ? new Date(a.plannedConnectionDate).getTime() : 0;
        valueB = b.plannedConnectionDate ? new Date(b.plannedConnectionDate).getTime() : 0;
        break;
      default:
        return 0;
    }
    
    if (valueA < valueB) return direction === 'asc' ? -1 : 1;
    if (valueA > valueB) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const getUniqueValues = (connections: Connection[]) => {
  const uniqueSuppliers = [...new Set(connections.map(conn => conn.supplier))];
  const uniqueGridOperators = [...new Set(connections.map(conn => conn.gridOperator))];
  const uniqueObjectTypes = [...new Set(connections.map(conn => conn.object.split(' ')[0]))];
  
  return {
    uniqueSuppliers,
    uniqueGridOperators,
    uniqueObjectTypes
  };
};

// New function to check for connection planning warnings
export const checkConnectionPlanningWarning = (connection: Connection, projectEndDate?: string) => {
  if (!connection.plannedConnectionDate) {
    return {
      message: 'Geen aansluitdatum gepland',
      severity: 'warning'
    };
  }

  const plannedDate = new Date(connection.plannedConnectionDate);
  const currentDate = new Date();
  const twelveWeeksFromNow = new Date();
  twelveWeeksFromNow.setDate(currentDate.getDate() + 12 * 7);

  if (plannedDate < twelveWeeksFromNow) {
    return {
      message: 'Kritieke planning: minder dan 12 weken',
      severity: 'critical'
    };
  }

  if (projectEndDate && plannedDate > new Date(projectEndDate)) {
    return {
      message: 'Aansluitdatum na project-einddatum',
      severity: 'warning'
    };
  }

  return null;
};

// Functie om project fase in leesbare tekst weer te geven
export const getProjectPhaseLabel = (phase?: string) => {
  switch (phase) {
    case 'REQUEST':
      return 'Aanvraag';
    case 'PLANNING':
      return 'Planning';
    case 'IMPLEMENTATION':
      return 'Realisatie';
    case 'ACTIVE':
      return 'In gebruik';
    case 'CLOSED':
      return 'Afgesloten';
    default:
      return 'Onbekend';
  }
};

// Functie om inkoop status in leesbare tekst weer te geven
export const getPurchaseStatusLabel = (status?: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'Aangevraagd';
    case 'QUOTED':
      return 'Offerte ontvangen';
    case 'ORDERED':
      return 'Besteld';
    case 'DELIVERED':
      return 'Geleverd';
    case 'CANCELED':
      return 'Geannuleerd';
    default:
      return 'Onbekend';
  }
};

// Functie om inkoop status badge stijl te bepalen
export const getPurchaseStatusBadgeStyle = (status?: string) => {
  switch (status) {
    case 'REQUESTED':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
    case 'QUOTED':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'ORDERED':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
    case 'DELIVERED':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'CANCELED':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};
