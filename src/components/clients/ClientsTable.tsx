
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { Organization } from '@/types/client';

interface ClientsTableProps {
  organizations: Organization[];
  loading: boolean;
  onEditOrganization: (orgId: string) => void;
}

export function ClientsTable({ organizations, loading, onEditOrganization }: ClientsTableProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <p>Organisaties laden...</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Naam</TableHead>
          <TableHead>Aantal Gebruikers</TableHead>
          <TableHead>Toegewezen Consultant</TableHead>
          <TableHead>Locatie</TableHead>
          <TableHead className="text-right">Acties</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8">
              Geen organisaties gevonden.
            </TableCell>
          </TableRow>
        ) : (
          organizations.map((org) => (
            <TableRow key={org.id}>
              <TableCell className="font-medium">{org.name}</TableCell>
              <TableCell>{org.userCount || 0}</TableCell>
              <TableCell>{org.assignedConsultantName || '-'}</TableCell>
              <TableCell>{org.city || '-'}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => onEditOrganization(org.id)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
