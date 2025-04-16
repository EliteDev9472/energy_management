
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Project } from '@/types/hierarchy';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

interface ProjectDataTableProps {
  projects: Project[];
}

export function ProjectDataTable({ projects }: ProjectDataTableProps) {
  const navigate = useNavigate();
  const [sortColumn, setSortColumn] = useState<keyof Project>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sorting
  const handleSort = (column: keyof Project) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  // Sort projects
  const sortedProjects = [...projects].sort((a, b) => {
    const aValue = a[sortColumn] as string;
    const bValue = b[sortColumn] as string;
    
    if (!aValue && !bValue) return 0;
    if (!aValue) return 1;
    if (!bValue) return -1;
    
    const comparison = aValue.localeCompare(bValue);
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Onbekend';
    return new Date(dateString).toLocaleDateString('nl-NL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const goToProject = (id: string) => {
    navigate(`/projects/${id}`);
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string, text: string }> = {
      'concept': { bg: 'bg-gray-100', text: 'text-gray-800' },
      'in_aanvraag': { bg: 'bg-yellow-100', text: 'text-yellow-800' },
      'lopend': { bg: 'bg-green-100', text: 'text-green-800' },
      'afgerond': { bg: 'bg-blue-100', text: 'text-blue-800' }
    };
    
    const style = statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${style.bg} ${style.text}`;
  };

  // Format status for display
  const formatStatus = (status: string) => {
    const statusMap: Record<string, string> = {
      'concept': 'Concept',
      'in_aanvraag': 'In aanvraag',
      'lopend': 'Actief',
      'afgerond': 'Afgerond'
    };
    return statusMap[status] || status;
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-md">
        <p className="text-muted-foreground mb-4">Geen projecten gevonden</p>
        <Button onClick={() => navigate('/projects/new')}>Nieuw project aanmaken</Button>
      </div>
    );
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Naam
            </TableHead>
            <TableHead>Locatie</TableHead>
            <TableHead>Aangemaakt op</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aantal aansluitingen</TableHead>
            <TableHead className="text-right">Acties</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedProjects.map((project) => (
            <TableRow 
              key={project.id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => goToProject(project.id)}
            >
              <TableCell className="font-medium">{project.name}</TableCell>
              <TableCell>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                  {project.city || 'Onbekend'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                  {formatDate(project.createdAt || project.created_at)}
                </div>
              </TableCell>
              <TableCell>
                <div className={getStatusBadge(project.status)}>
                  {formatStatus(project.status)}
                </div>
              </TableCell>
              <TableCell>{project.connectionCount || 0}</TableCell>
              <TableCell 
                className="text-right"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent row click from triggering
                }}
              >
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${project.id}`);
                  }}
                >
                  Details <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
