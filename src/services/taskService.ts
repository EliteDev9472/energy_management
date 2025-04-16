
import { ProjectTask } from '@/types/project';
import { getTasks } from '@/data/mockTasks';
import { toast } from '@/hooks/use-toast';
import { getTeamMemberById } from '@/data/mockTeamMembers';

// Cache van taken
let tasksCache: ProjectTask[] = [];

// Initialiseer de cache bij het laden van de service
const initializeCache = () => {
  if (tasksCache.length === 0) {
    tasksCache = [...getTasks()];
  }
};

export const getAllTasks = (): ProjectTask[] => {
  initializeCache();
  return tasksCache;
};

export const getFilteredTasks = (
  status: 'all' | 'open' | 'in_progress' | 'completed',
  searchQuery: string
): ProjectTask[] => {
  initializeCache();
  
  return tasksCache.filter(task => {
    const matchesStatus = status === 'all' || task.status === status;
    const matchesSearch = searchQuery 
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesStatus && matchesSearch;
  });
};

export const addTask = (task: Omit<ProjectTask, 'id'>): ProjectTask => {
  initializeCache();
  
  const newTask: ProjectTask = {
    ...task,
    id: `task-${Date.now()}`
  };
  
  tasksCache.push(newTask);
  
  const assigneeName = task.assignedTo 
    ? getTeamMemberById(task.assignedTo)?.name || 'teamlid'
    : 'niemand';
  
  toast({
    title: "Taak toegevoegd",
    description: `Nieuwe taak "${newTask.title}" is toegewezen aan ${assigneeName}.`
  });
  
  return newTask;
};

export const updateTask = (task: ProjectTask): boolean => {
  initializeCache();
  
  const index = tasksCache.findIndex(t => t.id === task.id);
  if (index === -1) return false;
  
  tasksCache[index] = { ...task };
  
  toast({
    title: "Taak bijgewerkt",
    description: `De taak "${task.title}" is bijgewerkt.`
  });
  
  return true;
};

export const deleteTask = (id: string): boolean => {
  initializeCache();
  
  const index = tasksCache.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  const deletedTask = tasksCache[index];
  tasksCache.splice(index, 1);
  
  toast({
    title: "Taak verwijderd",
    description: `De taak "${deletedTask.title}" is verwijderd.`
  });
  
  return true;
};

export const completeTask = (id: string): boolean => {
  initializeCache();
  
  const index = tasksCache.findIndex(t => t.id === id);
  if (index === -1) return false;
  
  tasksCache[index] = { 
    ...tasksCache[index], 
    status: 'completed' 
  };
  
  toast({
    title: "Taak afgerond",
    description: `De taak "${tasksCache[index].title}" is gemarkeerd als afgerond.`
  });
  
  return true;
};

export const getTasksForTeamMember = (teamMemberId: string): ProjectTask[] => {
  initializeCache();
  return tasksCache.filter(task => task.assignedTo === teamMemberId);
};

export const getTasksCountByStatus = (): Record<string, number> => {
  initializeCache();
  
  return {
    total: tasksCache.length,
    open: tasksCache.filter(task => task.status === 'open').length,
    in_progress: tasksCache.filter(task => task.status === 'in_progress').length,
    completed: tasksCache.filter(task => task.status === 'completed').length
  };
};
