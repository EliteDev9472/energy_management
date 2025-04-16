
import { PageLayout } from '@/components/layout/PageLayout';
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProjectOverview } from '@/components/dashboard/ProjectOverview';
import { ConnectionsOverview } from '@/components/dashboard/ConnectionsOverview';
import { RecentProjects } from '@/components/dashboard/RecentProjects';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { Building, FolderOpen, ListFilter, CheckSquare } from 'lucide-react';
import { getDashboardStats, getTasksCountByStatus } from '@/services/dashboardService';
import { DashboardStats } from '@/services/dashboardService';

export default function Index() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    totalObjects: 0,
    totalConnections: 0,
    activeConnections: 0,
    pendingTasks: 0
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    async function fetchDashboardData() {
      try {
        setLoading(true);
        // Fetch real stats from the database
        const dashboardStats = await getDashboardStats();
        const taskStats = await getTasksCountByStatus();
        
        setStats({
          ...dashboardStats,
          pendingTasks: taskStats.open + taskStats.in_progress
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [user, navigate]);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cedrus-green"></div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welkom bij het Cedrus Energiebeheer Platform
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatCard
            title="Actieve Projecten"
            value={stats.activeProjects}
            description={`Van ${stats.totalProjects} totaal`}
            icon={<FolderOpen className="h-5 w-5" />}
          />
          <StatCard
            title="Objecten"
            value={stats.totalObjects}
            description="Gebouwen en locaties"
            icon={<Building className="h-5 w-5" />}
          />
          <StatCard
            title="Aansluitingen"
            value={stats.activeConnections}
            description={`Van ${stats.totalConnections} totaal`}
            icon={<ListFilter className="h-5 w-5" />}
          />
          <StatCard
            title="Openstaande Taken"
            value={stats.pendingTasks}
            description="Acties vereist"
            icon={<CheckSquare className="h-5 w-5" />}
          />
        </div>

        {/* Main dashboard content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Left column - Project information */}
          <div className="lg:col-span-2 space-y-6">
            <ProjectOverview />
            <ConnectionsOverview />
          </div>
          
          {/* Right column - Quick actions and recent activities */}
          <div className="space-y-6">
            <QuickActions />
            <RecentProjects />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
