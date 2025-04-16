
import React, { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TeamMembersList } from '@/components/team/TeamMembersList';
import { TeamMemberForm } from '@/components/team/TeamMemberForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { getAllTeamMembers } from '@/services/teamService';
import { getTasksCountByStatus } from '@/services/taskService';

export default function TeamMembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [tasksCounts, setTasksCounts] = useState({
    total: 0,
    open: 0,
    in_progress: 0,
    completed: 0
  });

  // Fetch data when component mounts or refresh key changes
  useEffect(() => {
    const teamMembers = getAllTeamMembers();
    setTeamMembersCount(teamMembers.length);
    
    const taskStats = getTasksCountByStatus();
    // Make sure we maintain the expected structure
    setTasksCounts({
      total: taskStats.total || 0,
      open: taskStats.open || 0,
      in_progress: taskStats.in_progress || 0,
      completed: taskStats.completed || 0
    });
  }, [refreshKey]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleAddMember = () => {
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
  };

  const handleFormSubmit = () => {
    toast({
      title: "Teamlid toegevoegd",
      description: "Het nieuwe teamlid is succesvol toegevoegd.",
    });
    setShowAddForm(false);
    refreshList();
  };

  const refreshList = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <PageLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Teamleden</h1>
        <p className="text-muted-foreground">Beheer uw teamleden en rollen</p>
      </div>

      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Totaal Teamleden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-2xl font-bold">{teamMembersCount}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Openstaande Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{tasksCounts.open + tasksCounts.in_progress}</span>
              <span className="ml-2 text-sm text-muted-foreground">van {tasksCounts.total} totaal</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Afgeronde Taken</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <span className="text-2xl font-bold">{tasksCounts.completed}</span>
              <span className="ml-2 text-sm text-muted-foreground">
                ({Math.round((tasksCounts.completed / tasksCounts.total) * 100) || 0}%)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <TabsList>
            <TabsTrigger value="all">Alle teamleden</TabsTrigger>
            <TabsTrigger value="projectmanagers">Projectmanagers</TabsTrigger>
            <TabsTrigger value="consultants">Consultants</TabsTrigger>
            <TabsTrigger value="klantcontacten">Klantcontacten</TabsTrigger>
          </TabsList>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek teamleden..."
                className="pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <Button onClick={handleAddMember}>
              <Plus className="mr-2 h-4 w-4" />
              Nieuw teamlid
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Alle teamleden</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamMembersList 
                filter="all" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projectmanagers" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Projectmanagers</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamMembersList 
                filter="projectmanager" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consultants" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Consultants</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamMembersList 
                filter="consultant" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="klantcontacten" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Klantcontacten</CardTitle>
            </CardHeader>
            <CardContent>
              <TeamMembersList 
                filter="klantcontact" 
                searchQuery={searchQuery} 
                refreshList={refreshList}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showAddForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Nieuw teamlid toevoegen</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamMemberForm onSubmit={handleFormSubmit} onCancel={handleFormClose} />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
