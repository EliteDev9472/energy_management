
import { supabase } from '@/integrations/supabase/client';

export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalObjects: number;
  totalConnections: number;
  activeConnections: number;
  pendingTasks: number;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Fetch projects count
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('id, status');
    
    if (projectsError) throw projectsError;
    
    const activeProjects = projects?.filter(p => p.status === 'lopend') || [];
    
    // Fetch objects count
    const { count: objectsCount, error: objectsError } = await supabase
      .from('objects')
      .select('id', { count: 'exact', head: true });
    
    if (objectsError) throw objectsError;
    
    // Fetch connections count
    const { data: connections, error: connectionsError } = await supabase
      .from('connections')
      .select('id, status');
    
    if (connectionsError) throw connectionsError;
    
    const activeConnections = connections?.filter(c => c.status === 'Actief' || c.status === 'NEW' || c.status === 'IN_PROGRESS') || [];
    
    // Fetch tasks count
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select('id, status');
    
    if (tasksError) throw tasksError;
    
    const pendingTasks = tasks?.filter(t => t.status === 'open' || t.status === 'in_progress') || [];
    
    return {
      totalProjects: projects?.length || 0,
      activeProjects: activeProjects.length,
      totalObjects: objectsCount || 0,
      totalConnections: connections?.length || 0,
      activeConnections: activeConnections.length,
      pendingTasks: pendingTasks.length
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    // Return default values in case of error
    return {
      totalProjects: 0,
      activeProjects: 0,
      totalObjects: 0,
      totalConnections: 0,
      activeConnections: 0,
      pendingTasks: 0
    };
  }
};

interface RecentConnection {
  id: string;
  ean: string;
  address: string;
  city: string;
  type: string;
  status: string;
  object: string;
}

export const getRecentConnections = async (limit: number = 4): Promise<RecentConnection[]> => {
  try {
    const { data, error } = await supabase
      .from('connections')
      .select(`
        id, 
        ean,
        address,
        city,
        type,
        status,
        object
      `)
      .order('last_modified', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching recent connections:', error);
    return [];
  }
};

export const getTasksCountByStatus = async (): Promise<Record<string, number>> => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('status');
    
    if (error) throw error;
    
    const counts: Record<string, number> = {
      open: 0,
      in_progress: 0,
      completed: 0
    };
    
    data?.forEach(task => {
      if (counts[task.status] !== undefined) {
        counts[task.status]++;
      }
    });
    
    return counts;
  } catch (error) {
    console.error('Error fetching task counts:', error);
    return { open: 0, in_progress: 0, completed: 0 };
  }
};
