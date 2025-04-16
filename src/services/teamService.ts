
import { TeamMember } from '@/types/project';
import { getTeamMembers, getTeamMemberById, getTeamMembersByRole } from '@/data/mockTeamMembers';
import { toast } from '@/hooks/use-toast';

// Cache van teamleden
let teamMembersCache: TeamMember[] = [];

// Initialiseer de cache bij het laden van de service
const initializeCache = () => {
  if (teamMembersCache.length === 0) {
    teamMembersCache = [...getTeamMembers()];
  }
};

export const getAllTeamMembers = (): TeamMember[] => {
  initializeCache();
  return teamMembersCache;
};

export const getFilteredTeamMembers = (
  filter: 'all' | 'projectmanager' | 'consultant' | 'klantcontact' | 'team_member',
  searchQuery: string
): TeamMember[] => {
  initializeCache();
  
  return teamMembersCache.filter(member => {
    const matchesFilter = filter === 'all' || member.role === filter;
    const matchesSearch = searchQuery 
      ? member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    
    return matchesFilter && matchesSearch;
  });
};

export const addTeamMember = (member: Omit<TeamMember, 'id'>): TeamMember => {
  initializeCache();
  
  const newMember: TeamMember = {
    ...member,
    id: `${Date.now()}`
  };
  
  teamMembersCache.push(newMember);
  
  toast({
    title: "Teamlid toegevoegd",
    description: `${newMember.name} is succesvol toegevoegd aan het team.`
  });
  
  return newMember;
};

export const updateTeamMember = (member: TeamMember): boolean => {
  initializeCache();
  
  const index = teamMembersCache.findIndex(m => m.id === member.id);
  if (index === -1) return false;
  
  teamMembersCache[index] = { ...member };
  
  toast({
    title: "Teamlid bijgewerkt",
    description: `De gegevens van ${member.name} zijn bijgewerkt.`
  });
  
  return true;
};

export const deleteTeamMember = (id: string): boolean => {
  initializeCache();
  
  const index = teamMembersCache.findIndex(m => m.id === id);
  if (index === -1) return false;
  
  const deletedMember = teamMembersCache[index];
  teamMembersCache.splice(index, 1);
  
  toast({
    title: "Teamlid verwijderd",
    description: `${deletedMember.name} is verwijderd uit het team.`
  });
  
  return true;
};

export const getTeamMemberName = (id: string | undefined): string => {
  if (!id) return 'Niet toegewezen';
  
  const member = getTeamMemberById(id);
  return member ? member.name : 'Onbekend';
};
