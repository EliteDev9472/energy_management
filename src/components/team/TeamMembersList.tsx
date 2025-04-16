
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Edit, 
  Mail, 
  Trash2, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { TeamMember } from '@/types/project';
import { 
  getFilteredTeamMembers, 
  deleteTeamMember 
} from '@/services/teamService';
import { getTasksForTeamMember } from '@/services/taskService';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { TeamMemberForm } from './TeamMemberForm';
import { toast } from '@/hooks/use-toast';

interface TeamMembersListProps {
  filter: 'all' | 'projectmanager' | 'consultant' | 'klantcontact' | 'team_member';
  searchQuery: string;
  onEditMember?: (member: TeamMember) => void;
  refreshList: () => void;
}

export function TeamMembersList({ 
  filter, 
  searchQuery, 
  refreshList 
}: TeamMembersListProps) {
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  // Haal teamleden op
  const filteredTeamMembers = getFilteredTeamMembers(filter, searchQuery);

  // Role labels voor weergave in de UI
  const roleLabels: Record<TeamMember['role'], string> = {
    projectmanager: 'Projectmanager',
    consultant: 'Consultant',
    klantcontact: 'Klantcontact',
    team_member: 'Teamlid'
  };

  // Handlers voor acties
  const handleEdit = (member: TeamMember) => {
    setSelectedMember(member);
    setShowEditDialog(true);
  };

  const handleDelete = (member: TeamMember) => {
    setSelectedMember(member);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedMember) {
      // Controleer of het teamlid nog taken heeft
      const tasks = getTasksForTeamMember(selectedMember.id);
      
      if (tasks.length > 0) {
        toast({
          title: "Kan teamlid niet verwijderen",
          description: `Dit teamlid heeft ${tasks.length} taken toegewezen. Wijs deze eerst toe aan iemand anders.`,
          variant: "destructive"
        });
      } else {
        deleteTeamMember(selectedMember.id);
        refreshList();
      }
      
      setShowDeleteDialog(false);
    }
  };

  const handleEditSubmit = () => {
    setShowEditDialog(false);
    refreshList();
  };

  const handleEmailClick = (email: string) => {
    window.location.href = `mailto:${email}`;
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Naam</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Actieve projecten</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTeamMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  Geen teamleden gevonden die aan de criteria voldoen.
                </TableCell>
              </TableRow>
            ) : (
              filteredTeamMembers.map((member) => (
                <TableRow key={member.id}>
                  <TableCell className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      {member.avatar ? (
                        <AvatarImage src={member.avatar} alt={member.name} />
                      ) : (
                        <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="font-medium">{member.name}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50">
                      {roleLabels[member.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{member.email}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 6)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEmailClick(member.email)}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(member)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Teamlid bewerken</DialogTitle>
            <DialogDescription>
              Pas de gegevens van dit teamlid aan.
            </DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <TeamMemberForm 
              onSubmit={handleEditSubmit} 
              onCancel={() => setShowEditDialog(false)}
              initialValues={selectedMember}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Teamlid verwijderen</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u dit teamlid wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              {selectedMember?.name} zal worden verwijderd uit uw team.
            </p>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuleren</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
