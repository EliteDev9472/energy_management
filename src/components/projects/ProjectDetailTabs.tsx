
import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ProjectObjectsTab } from './objects/ProjectObjectsTab';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ChevronRight } from 'lucide-react';
import { ProjectBillingTab } from './ProjectBillingTab';

interface ProjectDetailTabsProps {
  projectId: string;
  projectName: string;
}

export const ProjectDetailTabs = ({ projectId, projectName }: ProjectDetailTabsProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Get the tab from URL if present
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location.search]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    
    // Update URL without full navigation
    const url = new URL(window.location.href);
    url.searchParams.set('tab', value);
    window.history.pushState({}, '', url.toString());
  };

  const handleConnectionsClick = () => {
    // Navigate to connections page with this project filter
    navigate(`/connections?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`);
  };

  const handleNewConnectionClick = () => {
    // Navigate to new connection page with this project pre-selected
    navigate(`/connections/new?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList className="mb-4 w-full max-w-full overflow-x-auto">
        <TabsTrigger value="overview">Overzicht</TabsTrigger>
        <TabsTrigger value="objects">Objecten</TabsTrigger>
        <TabsTrigger value="connections">Aansluitingen</TabsTrigger>
        <TabsTrigger value="billing">Facturatie</TabsTrigger>
        <TabsTrigger value="collaboration">Samenwerking</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        {/* This will be filled by the existing ProjectDetailPage content */}
      </TabsContent>
      
      <TabsContent value="objects">
        <ProjectObjectsTab projectId={projectId} projectName={projectName} />
      </TabsContent>
      
      <TabsContent value="connections">
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">Aansluitingen overzicht voor dit project.</p>
          <div className="flex justify-center gap-4">
            <Button 
              onClick={handleConnectionsClick}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              asChild
            >
              <Link to={`/connections?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`}>
                <ChevronRight className="h-4 w-4 mr-2" />
                Bekijk aansluitingen
              </Link>
            </Button>
            <Button 
              onClick={handleNewConnectionClick}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
              asChild
            >
              <Link to={`/connections/new?projectId=${projectId}&projectName=${encodeURIComponent(projectName)}`}>
                <Plus className="h-4 w-4 mr-2" />
                Nieuwe aansluiting
              </Link>
            </Button>
          </div>
        </div>
      </TabsContent>
      
      <TabsContent value="billing">
        <ProjectBillingTab projectId={projectId} projectName={projectName} />
      </TabsContent>
      
      <TabsContent value="collaboration">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Samenwerking voor dit project.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
};
