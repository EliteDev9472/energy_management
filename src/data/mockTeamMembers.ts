
import { TeamMember } from '@/types/project';

// Mock team members data
const mockTeamMembers: TeamMember[] = [
  { 
    id: '1', 
    name: 'Jan de Vries', 
    role: 'projectmanager', 
    email: 'jan@cedrus.nl', 
    avatar: '/lovable-uploads/52a4657a-f5e9-4577-8d47-1640709965b1.png' 
  },
  { 
    id: '2', 
    name: 'Lisa Bakker', 
    role: 'consultant', 
    email: 'lisa@cedrus.nl' 
  },
  { 
    id: '3', 
    name: 'Mohammed El Amrani', 
    role: 'klantcontact', 
    email: 'mohammed@cedrus.nl' 
  },
  { 
    id: '4', 
    name: 'Sarah Johnson', 
    role: 'team_member', 
    email: 'sarah@cedrus.nl' 
  },
  { 
    id: '5', 
    name: 'Mike Peters', 
    role: 'projectmanager', 
    email: 'mike@cedrus.nl' 
  },
  { 
    id: '6', 
    name: 'Emma de Groot', 
    role: 'consultant', 
    email: 'emma@cedrus.nl' 
  },
  { 
    id: '7', 
    name: 'Robert Klein', 
    role: 'klantcontact', 
    email: 'robert@cedrus.nl' 
  },
  { 
    id: '8', 
    name: 'Fatima Ahmadi', 
    role: 'consultant', 
    email: 'fatima@cedrus.nl' 
  },
  { 
    id: '9', 
    name: 'Thomas Berg', 
    role: 'projectmanager', 
    email: 'thomas@cedrus.nl' 
  },
  { 
    id: '10', 
    name: 'Annika Jansen', 
    role: 'team_member', 
    email: 'annika@cedrus.nl' 
  },
];

export const getTeamMembers = (): TeamMember[] => {
  return mockTeamMembers;
};

export const getTeamMemberById = (id: string): TeamMember | undefined => {
  return mockTeamMembers.find(member => member.id === id);
};

export const getTeamMembersByRole = (role: TeamMember['role']): TeamMember[] => {
  return mockTeamMembers.filter(member => member.role === role);
};
