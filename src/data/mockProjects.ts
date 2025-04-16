import { Project, ProjectStatus, BuildingPhase, ConnectionRequest } from '@/types/project';
import { format, addDays, subDays, addMonths } from 'date-fns';

// Helper to create a date string
const dateStr = (daysFromNow: number) => format(addDays(new Date(), daysFromNow), 'yyyy-MM-dd');

// Generate random building phases
const buildingPhases: BuildingPhase[] = ['planning', 'ontwerp', 'constructie', 'afwerking', 'oplevering', 'onderhoud'];
const getRandomBuildingPhase = (): BuildingPhase => buildingPhases[Math.floor(Math.random() * buildingPhases.length)];

// Generate random project statuses
const projectStatuses: ProjectStatus[] = ['concept', 'in_aanvraag', 'lopend', 'afgerond'];
const getRandomProjectStatus = (): ProjectStatus => projectStatuses[Math.floor(Math.random() * projectStatuses.length)];

// Helper to generate a project number
const generateProjectNumber = (id: number): string => {
  return `PRJ-${new Date().getFullYear()}-${id.toString().padStart(4, '0')}`;
};

// Generate mock team members
const teamMembers = [
  { id: '1', name: 'Jan de Vries', role: 'projectmanager' as const, email: 'jan@cedrus.nl', avatar: '/lovable-uploads/52a4657a-f5e9-4577-8d47-1640709965b1.png' },
  { id: '2', name: 'Lisa Bakker', role: 'consultant' as const, email: 'lisa@cedrus.nl' },
  { id: '3', name: 'Mohammed El Amrani', role: 'klantcontact' as const, email: 'mohammed@cedrus.nl' },
  { id: '4', name: 'Sarah Johnson', role: 'team_member' as const, email: 'sarah@cedrus.nl' },
  { id: '5', name: 'Mike Peters', role: 'projectmanager' as const, email: 'mike@cedrus.nl' },
  { id: '6', name: 'Emma de Groot', role: 'consultant' as const, email: 'emma@cedrus.nl' },
];

// Generate project tasks
const generateTasks = (projectId: string) => {
  return [
    {
      id: `task-${projectId}-1`,
      title: 'Voorbereiden projectdocumentatie',
      description: 'Verzamel alle benodigde documenten en maak een projectmap aan',
      assignedTo: teamMembers[0].id,
      dueDate: dateStr(7),
      status: 'open' as const,
      priority: 'medium' as const,
    },
    {
      id: `task-${projectId}-2`,
      title: 'Versturen netbeheerdersaanvragen',
      description: 'Aanvragen indienen bij relevante netbeheerders voor nieuwe aansluitingen',
      assignedTo: teamMembers[1].id,
      dueDate: dateStr(14),
      status: 'in_progress' as const,
      priority: 'high' as const,
    },
    {
      id: `task-${projectId}-3`,
      title: 'Klantvergadering plannen',
      description: 'Afspraak inplannen met klant om voortgang te bespreken',
      assignedTo: teamMembers[2].id,
      dueDate: dateStr(5),
      status: 'completed' as const,
      priority: 'low' as const,
    },
  ];
};

// Generate project comments
const generateComments = (projectId: string) => {
  return [
    {
      id: `comment-${projectId}-1`,
      text: 'Leverancier heeft bevestigd dat zij alle aansluitingen kunnen realiseren binnen de gewenste termijn.',
      createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd HH:mm:ss'),
      createdBy: teamMembers[0].id,
      createdByName: teamMembers[0].name,
      createdByAvatar: teamMembers[0].avatar,
    },
    {
      id: `comment-${projectId}-2`,
      text: 'Klant heeft gevraagd om extra documentatie over de duurzaamheidsopties. Ik heb deze vandaag verstuurd.',
      createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd HH:mm:ss'),
      createdBy: teamMembers[2].id,
      createdByName: teamMembers[2].name,
    },
  ];
};

// Create mock projects
export const mockProjects: Project[] = [
  {
    id: '1',
    projectNumber: 'PRJ-2025-0001',
    name: 'Woonwijk Zonnepark',
    address: 'Zonneweide 123',
    city: 'Amersfoort',
    customer: 'Gemeente Amersfoort',
    buildingPhase: 'constructie',
    status: 'lopend',
    startDate: format(subDays(new Date(), 90), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 180), 'yyyy-MM-dd'),
    projectManager: teamMembers[0].id,
    connectionCount: 32,
    notes: '<p>Dit project omvat 32 woningen in de nieuwe wijk Zonnepark. Alle woningen worden voorzien van zonnepanelen en warmtepompen.</p><p>De infrastructuur moet worden aangelegd voor deze nieuwe wijk.</p>',
    documents: [
      { id: 'd1', name: 'Project Plan.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'), uploadedBy: teamMembers[0].id },
      { id: 'd2', name: 'Technische Specificaties.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'), uploadedBy: teamMembers[1].id },
    ],
    team: [teamMembers[0], teamMembers[1], teamMembers[2]],
    tasks: generateTasks('1'),
    comments: generateComments('1'),
    createdAt: format(subDays(new Date(), 120), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    categoryId: 'category-1',
  },
  {
    id: '2',
    projectNumber: 'PRJ-2025-0002',
    name: 'Kantoorpand Utrecht',
    address: 'Stationsplein 15',
    city: 'Utrecht',
    customer: 'ABC Vastgoed BV',
    buildingPhase: 'ontwerp',
    status: 'in_aanvraag',
    startDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 365), 'yyyy-MM-dd'),
    projectManager: teamMembers[4].id,
    connectionCount: 5,
    notes: '<p>Renovatie van een bestaand kantoorpand. De energievoorziening moet worden gemoderniseerd met focus op duurzaamheid.</p>',
    documents: [
      { id: 'd3', name: 'Offerte.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'), uploadedBy: teamMembers[4].id },
    ],
    team: [teamMembers[4], teamMembers[5]],
    tasks: generateTasks('2'),
    comments: generateComments('2'),
    createdAt: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    categoryId: 'category-2',
  },
  {
    id: '3',
    projectNumber: 'PRJ-2025-0003',
    name: 'Appartementencomplex Zuid',
    address: 'Zuidergracht 78',
    city: 'Rotterdam',
    customer: 'Woonbouw Nederland',
    buildingPhase: 'afwerking',
    status: 'lopend',
    startDate: format(subDays(new Date(), 180), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
    projectManager: teamMembers[0].id,
    connectionCount: 48,
    notes: '<p>Groot appartementencomplex met 48 wooneenheden. Alle units hebben individuele meters nodig en er moet centrale infrastructuur komen voor gemeenschappelijke ruimtes.</p>',
    documents: [
      { id: 'd4', name: 'Bouwtekeningen.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 160), 'yyyy-MM-dd'), uploadedBy: teamMembers[1].id },
      { id: 'd5', name: 'Contracten Netbeheerder.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 150), 'yyyy-MM-dd'), uploadedBy: teamMembers[0].id },
    ],
    team: [teamMembers[0], teamMembers[1], teamMembers[3]],
    tasks: generateTasks('3'),
    comments: generateComments('3'),
    createdAt: format(subDays(new Date(), 200), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    categoryId: 'category-1',
  },
  {
    id: '4',
    projectNumber: 'PRJ-2025-0004',
    name: 'Winkelcentrum Oost',
    address: 'Oostplein 234',
    city: 'Amsterdam',
    customer: 'Retail Investments BV',
    buildingPhase: 'onderhoud',
    status: 'afgerond',
    startDate: format(subDays(new Date(), 365), 'yyyy-MM-dd'),
    endDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    projectManager: teamMembers[4].id,
    connectionCount: 12,
    notes: '<p>Renovatie van bestaand winkelcentrum. Alle winkels hebben individuele aansluitingen gekregen.</p>',
    documents: [
      { id: 'd6', name: 'Eindrapportage.pdf', type: 'pdf', url: '#', uploadedAt: format(subDays(new Date(), 35), 'yyyy-MM-dd'), uploadedBy: teamMembers[4].id },
    ],
    team: [teamMembers[4], teamMembers[5], teamMembers[3]],
    tasks: generateTasks('4'),
    comments: generateComments('4'),
    createdAt: format(subDays(new Date(), 400), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    categoryId: 'category-1',
  },
];

// Generate 15 more projects to have a good amount of data
for (let i = 5; i <= 20; i++) {
  const startDate = format(subDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd');
  const endDate = Math.random() > 0.2 ? format(addDays(new Date(), Math.floor(Math.random() * 365)), 'yyyy-MM-dd') : null;
  
  mockProjects.push({
    id: i.toString(),
    projectNumber: generateProjectNumber(i),
    name: `Project ${i}`,
    address: `Straat ${Math.floor(Math.random() * 100)}`,
    city: ['Amsterdam', 'Rotterdam', 'Utrecht', 'Den Haag', 'Eindhoven'][Math.floor(Math.random() * 5)],
    customer: ['Gemeente', 'Vastgoed BV', 'Bouwbedrijf', 'Woningcorporatie', 'Investeerder'][Math.floor(Math.random() * 5)] + ' ' + 
              ['Noord', 'Zuid', 'Oost', 'West', 'Centrum'][Math.floor(Math.random() * 5)],
    buildingPhase: getRandomBuildingPhase(),
    status: getRandomProjectStatus(),
    startDate,
    endDate,
    projectManager: teamMembers[Math.floor(Math.random() * teamMembers.length)].id,
    connectionCount: Math.floor(Math.random() * 50) + 1,
    notes: '<p>Projectomschrijving en details...</p>',
    documents: [],
    team: [teamMembers[Math.floor(Math.random() * teamMembers.length)]],
    tasks: [],
    comments: [],
    createdAt: format(subDays(new Date(), Math.floor(Math.random() * 500)), 'yyyy-MM-dd'),
    updatedAt: format(subDays(new Date(), Math.floor(Math.random() * 30)), 'yyyy-MM-dd'),
    categoryId: 'category-' + Math.floor(Math.random() * 10),
  });
}

// Create mock connection requests for pipeline visualization
export const mockConnectionRequests: ConnectionRequest[] = [
  {
    id: 'cr1',
    objectId: 'obj1',
    objectName: "Building 1",
    address: 'Zonneweide 123, Unit 1',
    city: 'Amsterdam',
    postalCode: '1000AA',
    type: 'electricity',
    status: 'concept',
    supplier: null,
    requestDate: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 60), 'yyyy-MM-dd'),
  },
  {
    id: 'cr2',
    objectId: 'obj2',
    objectName: "Building 2",
    address: 'Zonneweide 123, Unit 2',
    city: 'Amsterdam',
    postalCode: '1000AB',
    type: 'electricity',
    ean: '871756678309878921',
    status: 'ingediend',
    supplier: 'Vattenfall',
    requestDate: format(subDays(new Date(), 15), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 45), 'yyyy-MM-dd'),
  },
  {
    id: 'cr3',
    objectId: 'obj3',
    objectName: "Building 3",
    address: 'Zonneweide 123, Unit 3',
    city: 'Amsterdam',
    postalCode: '1000AC',
    type: 'gas',
    ean: '871756678309878922',
    status: 'in_behandeling',
    supplier: 'Eneco',
    requestDate: format(subDays(new Date(), 20), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 30), 'yyyy-MM-dd'),
  },
  {
    id: 'cr4',
    objectId: 'obj4',
    objectName: "Building 4",
    address: 'Zonneweide 123, Unit 4',
    city: 'Amsterdam',
    postalCode: '1000AD',
    type: 'electricity',
    ean: '871756678309878923',
    status: 'goedgekeurd',
    supplier: 'Eneco',
    requestDate: format(subDays(new Date(), 25), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 15), 'yyyy-MM-dd'),
  },
  {
    id: 'cr5',
    objectId: 'obj5',
    objectName: "Building 5",
    address: 'Zonneweide 123, Unit 5',
    city: 'Amsterdam',
    postalCode: '1000AE',
    type: 'electricity',
    ean: '871756678309878924',
    status: 'aangesloten',
    supplier: 'Eneco',
    requestDate: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    desiredConnectionDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
  },
  {
    id: 'cr6',
    objectId: 'obj6',
    objectName: "Office Building 1",
    address: 'Stationsplein 15, Verdieping 1',
    city: 'Utrecht',
    postalCode: '3500AA',
    type: 'electricity',
    status: 'concept',
    supplier: null,
    requestDate: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 90), 'yyyy-MM-dd'),
  },
  {
    id: 'cr7',
    objectId: 'obj7',
    objectName: "Apartment 101",
    address: 'Zuidergracht 78, Apt 101',
    city: 'Rotterdam',
    postalCode: '3000AA',
    type: 'electricity',
    ean: '871756678309878925',
    status: 'ingediend',
    supplier: 'Vattenfall',
    requestDate: format(subDays(new Date(), 18), 'yyyy-MM-dd'),
    desiredConnectionDate: format(addDays(new Date(), 40), 'yyyy-MM-dd'),
  },
];

// Use this helper function to format status in Dutch
export const formatStatus = (status: ProjectStatus) => {
  const statusMap: Record<ProjectStatus, string> = {
    concept: 'Concept',
    in_aanvraag: 'In Aanvraag',
    lopend: 'Lopend',
    afgerond: 'Afgerond'
  };
  return statusMap[status];
};

// Use this helper function to format connection request status in Dutch
export const formatConnectionRequestStatus = (status: ConnectionRequest['status']) => {
  const statusMap: Record<ConnectionRequest['status'], string> = {
    concept: 'Concept',
    ingediend: 'Ingediend',
    in_behandeling: 'In Behandeling',
    goedgekeurd: 'Goedgekeurd',
    aangesloten: 'Aangesloten',
    NEW: 'Nieuwe aanvraag',
    IN_PROGRESS: 'In behandeling',
    OFFER_ACCEPTED: 'Offerte geaccepteerd',
    PLANNED: 'Gepland',
    EXECUTION: 'Uitvoering',
    CONNECTED: 'Aangesloten',
    WAITING_FOR_EVI: 'Wacht op EVI',
    WAITING_FOR_APPROVAL: 'Wacht op goedkeuring',
    ACTIVE: 'Actief',
    COMPLETED: 'Afgerond',
    CANCELLED: 'Geannuleerd',
    supplier_request: 'Leveranciersaanvraag',
    CONTRACT_REQUEST: "Contract aanvragen"
  };
  return statusMap[status];
};

// Use this helper function to format building phase in Dutch
export const formatBuildingPhase = (phase: BuildingPhase) => {
  const phaseMap: Record<BuildingPhase, string> = {
    planning: 'Planning',
    ontwerp: 'Ontwerp',
    constructie: 'Constructie',
    afwerking: 'Afwerking',
    oplevering: 'Oplevering',
    onderhoud: 'Onderhoud'
  };
  return phaseMap[phase];
};

// Get project manager name by ID
export const getProjectManagerName = (id: string) => {
  const manager = teamMembers.find(member => member.id === id);
  return manager ? manager.name : 'Onbekend';
};

// Get project by ID
export const getProjectById = (id: string) => {
  return mockProjects.find(project => project.id === id);
};

// Get connection requests for a project
export const getConnectionRequestsForProject = (projectId: string) => {
  return mockConnectionRequests;
};
