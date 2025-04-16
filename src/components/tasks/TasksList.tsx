
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ProjectTask } from '@/types/project';
import { getFilteredTasks, deleteTask, completeTask, updateTask } from '@/services/taskService';
import { getTeamMemberById } from '@/data/mockTeamMembers';
import { format, isPast, isToday } from 'date-fns';
import { nl } from 'date-fns/locale';
import { TaskForm } from './TaskForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';

interface TasksListProps {
  status: 'all' | 'open' | 'in_progress' | 'completed';
  searchQuery: string;
  refreshList: () => void;
}

export function TasksList({ status, searchQuery, refreshList }: TasksListProps) {
  const [selectedTask, setSelectedTask] = useState<ProjectTask | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Haal taken op
  const filteredTasks = getFilteredTasks(status, searchQuery);

  // Status labels voor weergave in de UI
  const statusLabels: Record<ProjectTask['status'], string> = {
    open: 'Open',
    in_progress: 'In uitvoering',
    completed: 'Afgerond'
  };

  // Status colors voor badges
  const statusColors: Record<ProjectTask['status'], string> = {
    open: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
    in_progress: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
    completed: 'bg-green-100 text-green-800 hover:bg-green-100'
  };

  // Priority labels voor weergave in de UI
  const priorityLabels: Record<ProjectTask['priority'], string> = {
    low: 'Laag',
    medium: 'Gemiddeld',
    high: 'Hoog'
  };

  // Priority colors voor badges
  const priorityColors: Record<ProjectTask['priority'], string> = {
    low: 'bg-slate-100 text-slate-800 hover:bg-slate-100',
    medium: 'bg-orange-100 text-orange-800 hover:bg-orange-100',
    high: 'bg-red-100 text-red-800 hover:bg-red-100'
  };

  // Handlers voor acties
  const handleEdit = (task: ProjectTask) => {
    setSelectedTask(task);
    setShowEditDialog(true);
  };

  const handleDelete = (task: ProjectTask) => {
    setSelectedTask(task);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (selectedTask) {
      deleteTask(selectedTask.id);
      setShowDeleteDialog(false);
      refreshList();
    }
  };

  const handleComplete = (task: ProjectTask) => {
    if (task.status !== 'completed') {
      completeTask(task.id);
      refreshList();
    }
  };

  const handleFormSubmit = () => {
    setShowEditDialog(false);
    refreshList();
  };

  const formatDueDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      
      if (isToday(date)) {
        return 'Vandaag';
      }
      
      return format(date, 'd MMMM yyyy', { locale: nl });
    } catch (error) {
      return dateStr;
    }
  };

  const isDueDatePast = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return isPast(date) && !isToday(date);
    } catch (error) {
      return false;
    }
  };

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Titel</TableHead>
              <TableHead>Toegewezen aan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioriteit</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead className="text-right">Acties</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6">
                  Geen taken gevonden die aan de criteria voldoen.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
                const assignedToMember = task.assignedTo 
                  ? getTeamMemberById(task.assignedTo) 
                  : null;
                
                const isPastDue = task.status !== 'completed' && 
                  task.dueDate && 
                  isDueDatePast(task.dueDate);
                
                return (
                  <TableRow key={task.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{task.title}</div>
                        <div className="text-sm text-muted-foreground mt-1 line-clamp-1">
                          {task.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assignedToMember ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-7 w-7">
                            {assignedToMember.avatar ? (
                              <AvatarImage src={assignedToMember.avatar} alt={assignedToMember.name} />
                            ) : (
                              <AvatarFallback>{assignedToMember.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            )}
                          </Avatar>
                          <span>{assignedToMember.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Niet toegewezen</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[task.status]} variant="outline">
                        {statusLabels[task.status]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={priorityColors[task.priority]} variant="outline">
                        {priorityLabels[task.priority]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {task.dueDate ? (
                        <div className={`flex items-center ${isPastDue ? 'text-destructive' : ''}`}>
                          {isPastDue && <AlertCircle className="h-3.5 w-3.5 mr-1.5" />}
                          {formatDueDate(task.dueDate)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Geen deadline</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleComplete(task)}
                          disabled={task.status === 'completed'}
                        >
                          <CheckCircle className={`h-4 w-4 ${task.status === 'completed' ? 'text-green-500' : ''}`} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(task)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Taak bewerken</DialogTitle>
            <DialogDescription>
              Pas de details van deze taak aan.
            </DialogDescription>
          </DialogHeader>
          {selectedTask && (
            <TaskForm 
              onSubmit={handleFormSubmit} 
              onCancel={() => setShowEditDialog(false)}
              initialValues={selectedTask}
              isEditing={true}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Taak verwijderen</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u deze taak wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2 py-3">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <p className="text-sm text-muted-foreground">
              "{selectedTask?.title}" zal permanent worden verwijderd.
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
