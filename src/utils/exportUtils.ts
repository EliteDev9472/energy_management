
import { Connection } from "@/types/connection";

export const exportToCSV = (connections: Connection[], visibleColumns: string[], fileName: string = 'connections.csv') => {
  if (connections.length === 0) {
    console.error('No data to export');
    return;
  }

  // Map internal column names to user-friendly column headers
  const columnMapping: Record<string, string> = {
    ean: 'EAN',
    address: 'Adres',
    type: 'Type',
    status: 'Status',
    supplier: 'Leverancier',
    object: 'Object',
    contract: 'Contract Einddatum',
    gridOperator: 'Netbeheerder',
    city: 'Stad',
    postalCode: 'Postcode',
    meteringCompany: 'Meetbedrijf',
    entity: 'Entiteit',
    organization: 'Organisatie',
    lastModified: 'Laatst Gewijzigd',
    // Nieuwe kolommen
    capacity: 'Capaciteit',
    hasFeedback: 'Teruglevering',
    plannedConnectionDate: 'Geplande Aansluitdatum',
    gridOperatorWorkNumber: 'Werknummer Netbeheerder'
  };
  
  // Create header row
  const headerRow = visibleColumns.map(column => columnMapping[column] || column);
  
  // Create data rows with only the visible columns
  const rows = connections.map(connection => {
    return visibleColumns.map(column => {
      if (column === 'contract') {
        return connection.contract.endDate;
      } else if (column === 'address') {
        return `${connection.address}, ${connection.postalCode} ${connection.city}`;
      } else if (column === 'hasFeedback') {
        return connection.hasFeedback ? 'Ja' : 'Nee';
      } else {
        // @ts-ignore - We know these properties exist on the connection object
        return connection[column]?.toString() || '';
      }
    });
  });
  
  // Combine headers and rows
  const csvContent = [
    headerRow.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  // Create and download the file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
