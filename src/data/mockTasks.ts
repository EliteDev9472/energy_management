
import { ProjectTask } from '@/types/project';
import { format, addDays, subDays } from 'date-fns';

// Helper to create a date string
const dateStr = (daysFromNow: number) => format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');

// Mock projects data for task assignment
const mockProjects = [
  { id: '1', name: 'Woonwijk Zonnepark' },
  { id: '2', name: 'Kantoorpand Utrecht' },
  { id: '3', name: 'Appartementencomplex Zuid' },
  { id: '4', name: 'Winkelcentrum Oost' },
];

// Mock tasks data
const mockTasks: ProjectTask[] = [
  {
    id: 'task-1',
    title: 'Voorbereiden projectdocumentatie',
    description: 'Verzamel alle benodigde documenten en maak een projectmap aan',
    assignedTo: '1',
    dueDate: dateStr(7),
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'task-2',
    title: 'Versturen netbeheerdersaanvragen',
    description: 'Aanvragen indienen bij relevante netbeheerders voor nieuwe aansluitingen',
    assignedTo: '2',
    dueDate: dateStr(14),
    status: 'in_progress',
    priority: 'high',
  },
  {
    id: 'task-3',
    title: 'Klantvergadering plannen',
    description: 'Afspraak inplannen met klant om voortgang te bespreken',
    assignedTo: '3',
    dueDate: dateStr(5),
    status: 'completed',
    priority: 'low',
  },
  {
    id: 'task-4',
    title: 'Offerte leverancier beoordelen',
    description: 'Beoordeel de ontvangen offerte en geef feedback aan de leverancier',
    assignedTo: '4',
    dueDate: dateStr(3),
    status: 'open',
    priority: 'high',
  },
  {
    id: 'task-5',
    title: 'Technische specificaties controleren',
    description: 'Controleer of alle technische specificaties voldoen aan de gestelde eisen',
    assignedTo: '5',
    dueDate: dateStr(10),
    status: 'in_progress',
    priority: 'medium',
  },
  {
    id: 'task-6',
    title: 'Voortgangsrapportage opstellen',
    description: 'Stel een voortgangsrapportage op voor het management team',
    assignedTo: '6',
    dueDate: dateStr(8),
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'task-7',
    title: 'Contacteren van leveranciers',
    description: 'Neem contact op met leveranciers voor het plannen van installaties',
    assignedTo: '1',
    dueDate: dateStr(4),
    status: 'in_progress',
    priority: 'high',
  },
  {
    id: 'task-8',
    title: 'Vergunningen aanvragen',
    description: 'Vraag de benodigde vergunningen aan bij de gemeente',
    assignedTo: '2',
    dueDate: dateStr(20),
    status: 'open',
    priority: 'high',
  },
  {
    id: 'task-9',
    title: 'Inspectie plannen',
    description: 'Plan een inspectie op locatie met het technische team',
    assignedTo: '3',
    dueDate: dateStr(15),
    status: 'open',
    priority: 'medium',
  },
  {
    id: 'task-10',
    title: 'Eindrapport schrijven',
    description: 'Schrijf het eindrapport met alle bevindingen en aanbevelingen',
    assignedTo: '4',
    dueDate: dateStr(30),
    status: 'open',
    priority: 'low',
  },
];

export const getTasks = (): ProjectTask[] => {
  return mockTasks;
};

export const getTaskById = (id: string): ProjectTask | undefined => {
  return mockTasks.find(task => task.id === id);
};

export const getTasksByStatus = (status: ProjectTask['status']): ProjectTask[] => {
  return mockTasks.filter(task => task.status === status);
};

export const getTasksByAssignee = (assigneeId: string): ProjectTask[] => {
  return mockTasks.filter(task => task.assignedTo === assigneeId);
};

export const getProjects = () => {
  return mockProjects;
};
